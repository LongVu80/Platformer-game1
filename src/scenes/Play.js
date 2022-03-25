import Phaser from 'phaser';
import Player from '../entities/Player';
import Enemies from '../groups/Enemies';
import Collectables from '../groups/Collectables';
import Hud from '../hud';
import EventEmitter from '../events/Emmiter'
import miniBoss from '../entities/MiniBoss';

import initAnims from '../anims';


class Play extends Phaser.Scene {

  constructor(config) {
    super('PlayScene');
    this.config = config;
  }

  
  create({gameStatus}) {

    
    this.score = 0;
    this.hud = new Hud(this, 0, 0);

    const map = this.createMap();

    initAnims(this.anims);

    const layers = this.createLayers(map);
    const playerZones = this.getPlayerZones(layers.playerZones);
    const player = this.createPlayer(playerZones.start);
    const enemies = this.createEnemies(layers.enemySpawns, layers.platformsColliders);
    const collectables = this.createCollectables(layers.collectables);
    const miniBosses =this.createMiniBoss(layers.miniBosses);

    

    this.createEnemyColliders(enemies, {
      colliders: {
        platformsColliders: layers.platformsColliders,
        player
      }
    });

    this.createMiniBossColliders(miniBosses, {
      colliders: {
        platformsColliders: layers.platformsColliders,
        player
      }
    });

    this.createPlayerColliders(player, {
      colliders: {
        platformsColliders: layers.platformsColliders,
        projectiles: enemies.getProjectiles(),
        collectables,
        traps: layers.traps
      }
    });

    
    this.createEndOfLevel(playerZones.end, player);
    this.setupFollowupCameraOn(player);
    // this.createMiniBossFollow(miniBosses, player)

    if(gameStatus === 'PLAYER_LOOSE') { return;};
    this.createGameEvents();
  }

  createMap() {
    const map = this.make.tilemap({key: 'map'});
    map.addTilesetImage('main_lev_build_1', 'tiles-1');
    return map;
  }

  createLayers(map) {
    const tileset = map.getTileset('main_lev_build_1');
    const platformsColliders = map.createStaticLayer('platforms_colliders', tileset);
    const environment = map.createStaticLayer('environment', tileset).setDepth(-2);
    const platforms = map.createStaticLayer('platforms', tileset);
    const playerZones = map.getObjectLayer('player_zones');
    const enemySpawns = map.getObjectLayer('enemy_spawns');
    const collectables = map.getObjectLayer('collectables');
    const traps = map.createStaticLayer('traps', tileset);
    const miniBosses = map.getObjectLayer('mini_bosses');

    platformsColliders.setCollisionByProperty({collides: true});
    traps.setCollisionByExclusion(-1)

    return { environment, 
      platforms, 
      platformsColliders, 
      playerZones, 
      enemySpawns,
      collectables,
      traps,
      miniBosses };
  }

  createGameEvents() {
    EventEmitter.on('PLAYER_LOOSE', () => {
      console.log('Hello!');
      this.scene.restart({gameStatus: 'PLAYER_LOOSE'});
    })
  }

  createCollectables(collectableLayer){
    const collectables = new Collectables(this).setDepth(-1);
    collectables.addFromLayer(collectableLayer);
    collectables.playAnimation('diamond-shine');
    
    return collectables;
  }

  createPlayer(start) {
    return new Player(this, start.x, start.y);
  }

  createEnemies(spawnLayer, platformsColliders) {
    const enemies = new Enemies(this);
    const enemyTypes = enemies.getTypes();

    spawnLayer.objects.forEach((spawnPoint, i) => {
      // if (i === 1) { return; }
      const enemy = new enemyTypes[spawnPoint.type](this, spawnPoint.x, spawnPoint.y);
      enemy.setPlatformColliders(platformsColliders)
      enemies.add(enemy);
    })

    return enemies;
  }

  createMiniBoss(miniBossLayer) {
    return miniBossLayer.objects.map(miniBossPoint => {
      return new miniBoss(this, miniBossPoint.x, miniBossPoint.y);
    })
  }

  createMiniBossColliders(miniBosses, { colliders }) {
    miniBosses.forEach(miniBoss => {
      miniBoss
      .addCollider(colliders.platformsColliders)
    .addCollider(colliders.player, this.onPlayerCollision)
    .addCollider(colliders.player.projectiles, this.onHit)
    .addOverlap(colliders.player.meleeWeapon, this.onHit)
    
    })
  }

  createMiniBossFollow(miniBoss, player){
    var dx = player.x - miniBoss.x;
    var dy = player.y - miniBoss.y;

    if (Math.abs(dx) < 100 && Math.abs(dy) < 150) {
      physics.moveToObject(miniBoss, player, 100);
    } else {
      miniBoss.setVelocityX(0)
    }
  }

  // createEnemiesFollow(entity, source){
  //   entity.enemyFollows(source)
  // }
  

  onPlayerCollision(enemy, player) {
    player.takesHit(enemy);
    
  }


  onHit(entity, source) {
    entity.takesHit(source)
  }

  onCollect(entity, collectable) {
    this.score += collectable.score;
    this.hud.updateScoreBoard(this.score);
    collectable.disableBody(true, true);
  }

  createEnemyColliders(enemies, { colliders }) {
    enemies
      .addCollider(colliders.platformsColliders)
      .addCollider(colliders.player, this.onPlayerCollision)
      .addCollider(colliders.player.projectiles, this.onHit)
      .addOverlap(colliders.player.meleeWeapon, this.onHit)

  }

  createPlayerColliders(player, { colliders }) {
    player
      .addCollider(colliders.platformsColliders)
      .addCollider(colliders.projectiles, this.onHit)
      .addCollider(colliders.traps, this.onHit)
      .addOverlap(colliders.collectables, this.onCollect, this)
  }

  setupFollowupCameraOn(player) {
    const { height, width, mapOffset, zoomFactor } = this.config;
    this.physics.world.setBounds(0, 0, width + mapOffset, height + 200);
    this.cameras.main.setBounds(0, 0, width + mapOffset, height).setZoom(zoomFactor);
    this.cameras.main.startFollow(player);
  }

  getPlayerZones(playerZonesLayer) {
    const playerZones = playerZonesLayer.objects;
    return {
      start: playerZones.find(zone => zone.name === 'startZone'),
      end: playerZones.find(zone => zone.name === 'endZone')
    }
  }

  createEndOfLevel(end, player) {
    const endOfLevel = this.physics.add.sprite(end.x, end.y, 'end')
      .setAlpha(0)
      .setSize(5, this.config.height)
      .setOrigin(0.5, 1);

    const eolOverlap = this.physics.add.overlap(player, endOfLevel, () => {
      eolOverlap.active = false;
      console.log('Payer has won!');
    })
  }

  // update() {
  //   this.createMiniBossFollow()
  // }
}

export default Play;