export type RockPaperScissor = {
  "version": "0.1.0",
  "name": "rock_paper_scissor",
  "instructions": [
    {
      "name": "createBet",
      "accounts": [
        {
          "name": "player",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "bet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "placeBet",
      "accounts": [
        {
          "name": "player",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "bet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "fight",
      "accounts": [
        {
          "name": "player",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "bet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "hand",
          "type": {
            "defined": "Hand"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "bet",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "player",
            "type": "publicKey"
          },
          {
            "name": "playerHand",
            "type": {
              "defined": "Hand"
            }
          },
          {
            "name": "opponentHand",
            "type": {
              "defined": "Hand"
            }
          },
          {
            "name": "result",
            "type": {
              "defined": "BetResult"
            }
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Hand",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Rock"
          },
          {
            "name": "Paper"
          },
          {
            "name": "Scissor"
          }
        ]
      }
    },
    {
      "name": "BetResult",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Win"
          },
          {
            "name": "Lose"
          },
          {
            "name": "Tie"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "PlayerHandInvalid"
    },
    {
      "code": 6001,
      "name": "OpponentHandInvalid"
    }
  ]
};

export const IDL: RockPaperScissor = {
  "version": "0.1.0",
  "name": "rock_paper_scissor",
  "instructions": [
    {
      "name": "createBet",
      "accounts": [
        {
          "name": "player",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "bet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "placeBet",
      "accounts": [
        {
          "name": "player",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "bet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "fight",
      "accounts": [
        {
          "name": "player",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "bet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "hand",
          "type": {
            "defined": "Hand"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "bet",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "player",
            "type": "publicKey"
          },
          {
            "name": "playerHand",
            "type": {
              "defined": "Hand"
            }
          },
          {
            "name": "opponentHand",
            "type": {
              "defined": "Hand"
            }
          },
          {
            "name": "result",
            "type": {
              "defined": "BetResult"
            }
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Hand",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Rock"
          },
          {
            "name": "Paper"
          },
          {
            "name": "Scissor"
          }
        ]
      }
    },
    {
      "name": "BetResult",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Win"
          },
          {
            "name": "Lose"
          },
          {
            "name": "Tie"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "PlayerHandInvalid"
    },
    {
      "code": 6001,
      "name": "OpponentHandInvalid"
    }
  ]
};
