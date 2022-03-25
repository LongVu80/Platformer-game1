

import Phaser from "phaser";
import Collectable from "../collectables/Collectable";

class Collectables extends Phaser.Physics.Arcade.StaticGroup{
    constructor(scene){
        super(scene.physics.world, scene);

        this.createFromConfig({
            classType: Collectable
        })
    }

    mapProperties(propertiesList) {
        if(!propertiesList||propertiesList.length === 0) { return {}; }

        return propertiesList.reduce((map, obj) => {
            map[obj.name] = obj.value;
            return map;
        }, {})
    }

    addFromLayer(layer){
        
        const {score: defaultScore, type} = this.mapProperties(layer.properties);

        layer.objects.forEach(collectable0 => {
            const collectable = this.get(collectable0.x, collectable0.y, type)
            const props = this.mapProperties(collectable0.properties);
            
            collectable.score = props.score || defaultScore;
            //upgrade size according to score
            if(collectable.score == 5){
                collectable.setScale(1.3)
            } else if(collectable.score == 10){
                collectable.setScale(1.7)
            } else if(collectable.score == 20){
                collectable.setScale(2)
            }

          })
    }
}

export default Collectables