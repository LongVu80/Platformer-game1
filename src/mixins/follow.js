


import Phaser from 'phaser';
import Player from '../entities/Player';
import miniBoss from '../entities/MiniBoss';

export default{
    

    miniBossFollow(){
        const player = new Player(this);
        const miniBosses = new miniBoss(this)
        if((player.body.position.x - miniBosses.body.position.x < 150) 
            && (player.body.position.x - miniBosses.body.position.x > -150)
            ){
          this.physics.moveToObject(miniBosses, player, 100);
            } 
            else {
                miniBosses.setVelocity(0)
            }
    }
}