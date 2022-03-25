
import Phaser from 'phaser';
import HealthBar from '../hud/HealthBar';
import initAnimations from './anims/playerAnims';

import collidable from '../mixins/collidable';
import anims from '../mixins/anims';
import Projectiles from '../attacks/Projectiles';
import MeleeWeapon from '../attacks/MeleeWeapon';
import { getTimestamp } from '../utils/functions';
import EventEmitter from '../events/Emmiter'
import follow from '../mixins/follow';


class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');

    scene.add.existing(this);
    scene.physics.add.existing(this);
    

    // Mixins
    Object.assign(this, collidable);
    Object.assign(this, anims);
    Object.assign(this, follow);

    this.init();
    this.initEvents();
  }

  init() {
    this.gravity = 500;
    // this.playerSpeed = 150;
    this.shoot= 25;
    this.jumpCount = 0;
    this.consecutiveJumps = 2;
    this.hasBeenHit = false;
    this.isSitDown = false;
    this.bounceVelocity = 250;
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;

    this.projectiles = new Projectiles(this.scene, 'iceball-1')
    this.meleeWeapon = new MeleeWeapon(this.scene, 0, 0, 'sword-default')
    this.timeFromLastSwing = null;

    this.health = 30;
    this.hp = new HealthBar(
      this.scene,
      this.scene.config.leftTopCorner.x + 5,
      this.scene.config.leftTopCorner.y + 5,
      2,
      this.health
    )

    this.body.setSize(20, 46);
    this.body.setGravityY(this.gravity);
    this.setCollideWorldBounds(true);
    this.setOrigin(0.5, 1);
    this.body.setMaxVelocity(250, 400);
      // this.body.setDragX(350);

    initAnimations(this.scene.anims);

    this.handleAttacks();
    this.handleMovements();
    
  }

  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
  }

  update() {
    
    if (this.hasBeenHit || this.isSitDown || !this.body) { return; }
    
     if(this.getBounds().y > this.scene.config.height) {
      EventEmitter.emit('PLAYER_LOOSE');
      return;
    }
    const { left, right, space, up} = this.cursors;
    const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);
    const isUpJustDown = Phaser.Input.Keyboard.JustDown(up);
    const onFloor = this.body.onFloor();

   

    if (left.isDown) {
      this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
      this.setVelocityX(-200);
      // this.setAccelerationX(-300);
      this.setFlipX(true);
    } else if (right.isDown) {
      this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
      // this.setAccelerationX(300);
      this.setVelocityX(200);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    if ((isSpaceJustDown || isUpJustDown) && (onFloor || this.jumpCount < 2)) {
      this.setVelocityY(-300)
      this.jumpCount++;
      
    }
    
    if ((isSpaceJustDown || isUpJustDown) && (!onFloor && this.jumpCount < 2)){
      this.play('doubleJump', true)
      this.setCollideWorldBounds(true);
      this.jumpCount++
    } 




    if (onFloor) {
      this.jumpCount = 0;
    }

    if(this.isPlayingAnims('shoot') || this.isPlayingAnims('down')) {
      return;
    }

    if(this.isPlayingAnims('doubleJump')) {
      return;
    }

    if(this.isPlayingAnims('fall')) {
      return;
    }
    
    

    onFloor ?
      this.body.velocity.x !== 0 ?
        this.play('run', true) : this.play('idle', true) :
      this.play('jump', true) 
  }

  // miniBossFollow(){
  //   const miniBoss = new miniBoss(this)
    
  //     if((this.body.position.x - miniBoss.body.position.x < 150) 
  //     && (this.body.position.x - miniBoss.body.position.x > -150)
  //     ){
  //   physics.moveToObject(miniBoss, this, 100);
  //     } 
  //     else {
  //         miniBosses.setVelocity(0)
  //     }
  // }

  handleAttacks() {
    this.scene.input.keyboard.on('keydown-D', () => {
      this.play('shoot', true);
     this.projectiles.fireProjectile(this, 'iceball');
    })

     this.scene.input.keyboard.on('keydown-F', () => {
       if (this.timeFromLastSwing &&
        this.timeFromLastSwing + this.meleeWeapon.attackSpeed > getTimestamp()){
          return;
        }
      this.play('shoot', true);
      this.meleeWeapon.swing(this);
      this.timeFromLastSwing = getTimestamp();
    })
  }

  handleMovements() {
    this.scene.input.keyboard.on('keydown-DOWN', () => {
      if(!this.body.onFloor()) { return; }
      this.body.setSize(this.width, this.height / 2);
      this.setOffset(0, this.height / 2);
      // this.setVelocityX(0);
      this.setDragX(135);
      this.play('down', true);
      this.isSitDown = true;
    })

    this.scene.input.keyboard.on('keyup-DOWN', () => {
      this.body.setSize(this.width, 46);
      this.setOffset(0, 0)
      this.isSitDown = false
    })
  }

  playDamageTween() {
    return this.scene.tweens.add({
      targets: this,
      duration: 100,
      repeat: -1,
      tint: 0xffffff
    })
  }

  bounceOff(source) {
    if(source.body) {
      this.body.touching.right ?
      this.setVelocityX(-this.bounceVelocity) :
      this.setVelocityX(this.bounceVelocity);

    } else {
      this.body.blocked.right ?
      this.setVelocityX(-this.bounceVelocity) :
      this.setVelocityX(this.bounceVelocity);
    }
    

      setTimeout(() => this.setVelocityY(-this.bounceVelocity), 0);
      this.play('fall', true)
  }
  // enemyFollows(source){
  //   if((this.x - source.body.x < 150) && (this.x - source.body.x > -150)){
  //     this.physics.moveToObject(source, this, 100)
  //   }
  // }
  takesHit(source) {
    if(this.hasBeenHit) {return}

    this.health -= source.damage || source.properties.damage || 0;
    if(this.health <= 0) {
      EventEmitter.emit('PLAYER_LOOSE');
      return;
    }
    this.hasBeenHit = true;
    this.bounceOff(source);
    const hitAnim = this.playDamageTween();

    
    this.hp.descrease(this.health);

    // source.delivers && source.deliversHit(this);
    source.deliversHit && source.deliversHit(this);

    this.scene.time.delayedCall(1000, () => {
      this.hasBeenHit = false;
      hitAnim.stop();
      this.clearTint();
    })
  }

  
}


export default Player;