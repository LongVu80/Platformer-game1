


export default anims => {
    // anims.create({
    //   key: 'idle',
    //   frames: anims.generateFrameNumbers('player', {start: 0, end: 8}),
    //   frameRate: 8,
    //   repeat: -1
    // })

    anims.create({
      key: 'idle',
      frames: anims.generateFrameNumbers('player', {start: 0, end: 2}),
      frameRate: 1
    })

    anims.create({
      key: 'run',
      frames: anims.generateFrameNumbers('player', {start: 3, end: 8}),
      frameRate: 10,
      repeat: -1
    })

    anims.create({
      key: 'jump',
      frames: anims.generateFrameNumbers('player', {start: 10, end: 11}),
      frameRate: 2,
      repeat: -1
    })

    anims.create({
      key: 'doubleJump',
      frames: anims.generateFrameNumbers('player', {start: 12, end: 22}),
      frameRate: 30,
      repeat: 0
    })

    anims.create({
      key: 'down',
      frames: anims.generateFrameNumbers('player-down'),
      frameRate: 5,
      repeat: 0
    })

    anims.create({
      key: 'shoot',
      frames: anims.generateFrameNumbers('fire-shoot', {start: 1, end: 3}),
      frameRate: 20,
      repeat: 0
    })

    anims.create({
      key: 'fall',
      frames: anims.generateFrameNumbers('player', {start: 23, end: 25}),
      frameRate: 20,
      repeat:0
    })
  
    // anims.create({
    //   key: 'run',
    //   frames: anims.generateFrameNumbers('player', {start: 11, end: 16}),
    //   frameRate: 8,
    //   repeat: -1
    // })
  
    // anims.create({
    //   key: 'jump',
    //   frames: anims.generateFrameNumbers('player', {start: 17, end: 23}),
    //   frameRate: 2,
    //   repeat: 1
    // })

    // anims.create({
    //   key: 'doubleJump',
    //   frames: anims.generateFrameNumbers('double-jump', {start: 0, end: 10}),
    //   frameRate: 30,
    //   repeat: 0
    // })

    anims.create({
      key: 'throw',
      frames: anims.generateFrameNumbers('player-throw', {start: 0, end: 7}),
      frameRate: 14,
      repeat: 0
    })

    
  }