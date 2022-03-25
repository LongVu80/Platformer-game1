import Phaser from "phaser";
import EffectManager from "../effects/EffectManager";


class MeleeWeapon extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, weaponName){
        super(scene, x, y, weaponName);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.damage = 15;
        this.attackSpeed = 350;
        this.weaponName = weaponName;
        this.weaponAnims = weaponName + '-swing'
        this.weilder = null;

        this.EffectManager = new EffectManager(this.scene);

        this.setOrigin(0.5, 1);
        this.setDepth(10)

        this.activateWeapon(false)

        this.on('animationcomplete', animation =>{
            if(animation.key === this.weaponAnims) {
                this.activateWeapon(false);
                this.body.checkCollision.none = false;
                this.body.reset(0, 0);
                
            }
        })
    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);

        if(!this.active) { return; }

        if(this.weilder.lastDirection === Phaser.Physics.Arcade.FACING_RIGHT) {
        this.setFlipX(false);
        this.body.reset(this.weilder.x + 25, this.weilder.y);
        } else {
            this.setFlipX(true);
        this.body.reset(this.weilder.x - 25, this.weilder.y)
        }
    }

    swing(weilder){
        this.weilder = weilder
        this.activateWeapon(true);
        this.anims.play(this.weaponAnims, true)
    }

    deliversHit(target){
        const impactPosition = { x: this.x, y: this.y };
        this.EffectManager.playEffectOn('hit-effect', target, impactPosition)
        this.body.checkCollision.none = true;
    }

    activateWeapon(isActive){
        this.setActive(isActive);
        this.setVisible(isActive);
    }
}

export default MeleeWeapon;