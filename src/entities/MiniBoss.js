import Phaser from 'phaser';

 import collidable from '../mixins/collidable';
 import follow from '../mixins/follow';
 import Player from './Player';

 class miniBoss extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y) {
     super(scene, x, y, 'miniBoss');

     scene.add.existing(this);
     scene.physics.add.existing(this);

     // Mixins
     Object.assign(this, collidable);
     Object.assign(this, follow)

     this.init();
   }

   init() {
     this.gravity = 500;
     this.speed = 150;
     this.health = 30;
     this.damage = 10;

     this.body.setGravityY(this.gravity);
     this.setImmovable();
     this.setCollideWorldBounds(true);
     this.setOrigin(0.5, 1);
     this.setSize(20, 38);
    this.setOffset(7, 0);
   }

   deliversHit(){}

  takesHit(source) {
    source.deliversHit(this);
    this.health -= source.damage
    this.setVelocityY(-100)

    if (this.health <= 0) {
      this.setTint(0xFF0000);
      this.setVelocity(0, -200);
      this.body.checkCollision.none = true;
      this.setCollideWorldBounds(false)
    }
  }

  // enemyFollows(source){
  //   if((source.body.x - this.x < 150) && (source.body.x - this.x > -150)){
  //     this.physics.moveToObject(this, source, 100)
  //   }
  // }
 
  update(){

     this.miniBossFollow()
 }
}

 


 export default miniBoss;