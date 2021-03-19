const config = require('../config.json');

module.exports = (code) => {

  const gameCode = code,
  players = {},
  words = [],
  usedWords = []

  let round = 1,
  rounds = config.rounds,
  currentDrawer = null,
  currentWord = null,
  currentWordHelp = null,
  playersOrder = [],
  status = 'waiting',
  drawingData = [],
  backgroundColor = '#fff',
  timeLeft = 0,
  guessed = {

    allInternal: 0,
    allListener: function(val) {},
    set all(val) {

      this.allInternal = val
      this.allListener(val)

    },
    get all() {

      return this.allInternal

    },
    registerListener: function(listener) {

      this.allListener = listener

    }

  }

  const getGameCode = () => {

    return gameCode;

  },
  getPlayers = () => {

    return players

  },
  getRound = () => {

    return round

  },
  getStatus = () => {

    return status

  },
  getWords = () => {

    return words

  },
  getRounds = () => {

    return rounds

  },
  getCurrentDrawer = () => {

    return currentDrawer

  }

  const addPlayer = (name, client) => {

    players[client.id] = { name: name, client: client, points: 0, didGuessWord: false }
    playersOrder.push(client.id)

    for(p in players) {

      players[p].client.emit('playerJoin', name, client.id)

    }

    sendAnnouncement(`${name} à rejoint la partie`)

  },
  addWord = (word) => {

    if(words.includes(word.toLowerCase()))
      return

    words.push(word.toLowerCase());

    for(p in players) {

      players[p].client.emit('wordAdded', words.length)

    }

  },
  removePlayer = (client) => {

    for(p in players) {

      players[p].client.emit('playerLeave', players[client.id].name, client.id)

    }

    sendAnnouncement(`${players[client.id].name} à quitté la partie`)

    delete players[client.id]
    playersOrder.splice(playersOrder.indexOf(client.id), 1)

  },
  shufflePlayers = () => {

    let currentIndex = playersOrder.length,
    temporaryValue = null,
    randomIndex = null

    while (0 !== currentIndex) {

      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      temporaryValue = playersOrder[currentIndex]
      playersOrder[currentIndex] = playersOrder[randomIndex]
      playersOrder[randomIndex] = temporaryValue

    }

  },
  startRound = async () => {

    shufflePlayers()

    for(p in players) {

      players[p].client.emit('roundNumberChange', round)

    }

    for(let i = 0; i < playersOrder.length; i++) {

      if(playersOrder.length == 0)
        return

      currentWord = words.length == 0 ? usedWords[Math.floor(Math.random() * usedWords.length)] : words[Math.floor(Math.random() * words.length)],
      currentWordHelp = '',
      currentDrawer = playersOrder[i]
      drawingData = []
      backgroundColor = '#fff'

      sendAnnouncement(`${players[playersOrder[i]].name} dessine!`)

      for(p in players) players[p].client.emit('receiveDrawingData', drawingData)

      for(let j = 0; j < currentWord.length; j++) currentWordHelp += '_'

      let startDrawing = new Promise((resolve, reject) => {

        let thisRound = true
        timeLeft = (config.timeout / 1000)

        let timeLeftCounter = setInterval(() => {

          if(!thisRound)
            return

          timeLeft--

          if(currentWordHelp != null && !(currentWordHelp.match(/_/g).length <= 1) && (timeLeft % 5 == 0)) {

            let underLineIndexes = []
            for(let i = 0; i < currentWordHelp.length; i++)
              if(currentWordHelp[i] == '_') underLineIndexes.push(i)

            let replaceIndex = Math.floor(Math.random() * underLineIndexes.length)
            currentWordHelp = currentWordHelp.substr(0, underLineIndexes[replaceIndex]) + currentWord[underLineIndexes[replaceIndex]] + currentWordHelp.substr(underLineIndexes[replaceIndex] + 1, currentWordHelp.length - underLineIndexes[replaceIndex] + 1)

            for(p in players) {

              if(p == currentDrawer || players[p].didGuessWord)
                continue

              players[p].client.emit('wordTip', currentWordHelp)

            }

          }

        }, 1000)

        const finishDrawing = () => {

          if(playersOrder.length == 0)
            return

          clearInterval(timeLeftCounter)

          let drawerPoints = 0

          for(p in players) {

            if(players[p].didGuessWord)
              drawerPoints += 10

          }

          if(players[currentDrawer] == undefined)
            return

          players[currentDrawer].points += drawerPoints

          for(p in players) {

            players[p].client.emit('pointsUpdate', currentDrawer, players[currentDrawer].points)

          }

          thisRound = false

          if(words.length != 0) {

            words.splice(words.indexOf(currentWord), 1)
            usedWords.push(currentWord)

          }

          resolve(1)

        }

        guessed.all = 0
        guessed.registerListener(function(val) {

          if(val == (playersOrder.length - 1))
            finishDrawing()

        })

        for(p in players) {

          players[p].client.emit('currentDrawer', currentDrawer)
          players[p].didGuessWord = false

          if(p == currentDrawer) {

            players[p].client.emit('drawWord', currentWord)
            continue

          }

          players[p].client.emit('drawWord', currentWordHelp)

        }

        setTimeout(() => {

          finishDrawing()

        }, config.timeout)

      }),
      drawingResult = await startDrawing

      if(i == (playersOrder.length - 1)) {

        if(round == rounds) {

          sendAnnouncement(`Fin de Partie!`)

          for(p in players) {

            players[p].client.emit('endGame')

          }

          return

        }

        sendAnnouncement(`Fin round ${round}!`)
        round++
        startRound()

      }

    }

  },
  startGame = () => {

    if(Object.keys(players).length < config.min_players || status != 'waiting') {

      sendAnnouncement(`Impossible de commencer: pas assez de joueurs (minimum ${config.min_players})`)
      return

    }

    if(words.length < config.min_words) {

      sendAnnouncement(`Impossible de commencer: pas assez de mots (minimum ${config.min_words})`)
      return

    }

    status = 'running'

    for(p in players) {

      players[p].client.emit('startGame', rounds, config.timeout)
      players[p].client.emit('statusChange', status)

    }

    startRound()

  },
  handleDrawingData = (newLine, canvasWidth) => {

    drawingData = newLine

    for(p in players) {

      if(p == currentDrawer)
        continue

      players[p].client.emit('receiveDrawingData', drawingData, canvasWidth)

    }

  },
  handleBackgroundColorChange = (bgColor) => {

    backgroundColor = bgColor

    for(p in players) {

      if(p == currentDrawer)
        continue

      players[p].client.emit('receiveBackgroundData', backgroundColor)

    }

  },
  erease = (offsetX, offsetY) => {

    for(p in players) {

      if(p == currentDrawer)
        continue

      players[p].client.emit('receiveRubber', offsetX, offsetY)

    }

  },
  sendMessage = (client, message) => {

    if(message == null || message == '')
      return

    if(currentWord != null && message.toLowerCase().replace(/\s/g, '') == currentWord.toLowerCase().replace(/\s/g, '') && status == 'running') {

      if(!players[client.id].didGuessWord && client.id != currentDrawer) {

        players[client.id].didGuessWord = true
        players[client.id].points += (timeLeft * 10)
        guessed.all++

        sendAnnouncement(`${players[client.id].name} Devine le mot!`)

        for(p in players) {

          players[p].client.emit('pointsUpdate', client.id, players[client.id].points)

        }

      }

      return

    }

    for(p in players) {

      players[p].client.emit('messageReceive', players[client.id].name, message)

    }

  },
  sendAnnouncement = (announcement) => {

    for(p in players) {

      players[p].client.emit('messageReceive', 'Announcement', announcement)

    }

  }

  return {

    getGameCode: getGameCode,
    getPlayers: getPlayers,
    getRound: getRound,
    getStatus: getStatus,
    getWords: getWords,
    getRounds: getRounds,
    getCurrentDrawer: getCurrentDrawer,
    addPlayer: addPlayer,
    addWord: addWord,
    removePlayer: removePlayer,
    sendMessage: sendMessage,
    startGame: startGame,
    handleDrawingData: handleDrawingData,
    handleBackgroundColorChange: handleBackgroundColorChange,
    erease: erease

  }

}
