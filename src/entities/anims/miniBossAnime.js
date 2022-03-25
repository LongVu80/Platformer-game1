

export default anims => {
    anims.create({
      key: 'miniBoss-idle',
      frames: anims.generateFrameNumbers('miniBoss', {start: 0, end: 8}),
      frameRate: 8,
      repeat: -1
    })

    anims.create({
      key: 'miniBoss-run',
      frames: anims.generateFrameNumbers('miniBoss', {start: 11, end: 16}),
      frameRate: 8,
      repeat: -1
    })
    
    // anims.create({
    //   key: 'miniBoss-hurt',
    //   frames: anims.generateFrameNumbers('miniBoss', {start: 25, end: 26}),
    //   frameRate: 10,
    //   repeat: 0
    // })

  }