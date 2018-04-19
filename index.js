var config = require("./configOriginal");
var util = require("./util");
var fs = require("fs");

var DEALER = "dealer",
	PLAYER = "player";
var WIN = "win",
	LOSE = "lose",
	DRAW = "draw";
var HIT = "hit",
	STAND = "stand";

var stats = {
	actions: {
		stand: {
			wins: 0,
			winPercentage: 0,
			losses: 0,
			losePercentage: 0,
			draws: 0,
			drawPercentage: 0
		},
		hit: {
			wins: 0,
			winPercentage: 0,
			losses: 0,
			losePercentage: 0,
			draws: 0,
			drawPercentage: 0
		}
	},
	results: {
		stand: {
			wins: [],
			losses: [],
			draws: []
		},
		hit: {
			wins: [],
			losses: [],
			draws: []
		}
	}		
};

var initShoe = initShoe(config.startingPlayerHand.cards.concat(config.startingDealerHand.cards));

var startTime = new Date();
var result = startSimulation(config.startingPlayerHand, config.startingDealerHand, initShoe);
var endTime = new Date();

console.log("PlayerHand:", config.startingPlayerHand);
console.log("DealerHand:", config.startingDealerHand);
console.log("Duration:", (endTime.getTime() - startTime.getTime()) / 1000, "s");
//fs.writeFileSync("./results.json", JSON.stringify(stats.actions) + JSON.stringify(stats.results));
//fs.writeFileSync("./stats.json", JSON.stringify(stats));

var jsonOutput = {
	stand: result.stand,
	hit: result.hit
};
fs.writeFileSync("./result.json", JSON.stringify(jsonOutput));

function startSimulation(playerHand, dealerHand, shoe) {
	var hit;
	var result = {
		stand: {
			winPercentage: 0,
			losePercentage: 0,
			drawPercentage: 0
		},
		hit: {
			winPercentage: 0,
			losePercentage: 0,
			drawPercentage: 0
		},
		dealer: {}
	};
	var simulatePlayerResult;
	
	// dealer gets his second card
	stats.playerHand = playerHand;
	stats.dealerHand = dealerHand;
	stats.turn = DEALER;
	stats.hit = {};
	config.cardList.forEach(card => {
		var newShoe = util.copyShoe(shoe);
		var newDealerHand = util.copyHand(dealerHand);
		var chanceToDraw = drawCard(card, newShoe);
		
		newDealerHand.cards.push(card);		
		newDealerHand.points = getHandValue(newDealerHand);
		
		hit = {
			chance: chanceToDraw,
			totalChance: chanceToDraw,
			playerHand: playerHand,
			dealerHand: newDealerHand
		};
		stats.hit[card] = hit;
		simulatePlayerResult = simulatePlayer(playerHand, newDealerHand, newShoe, hit, hit.totalChance, 1);
		
		if (simulatePlayerResult.totalChance > 0) {
			result.dealer[card] = simulatePlayerResult;
		}		
		result.stand.winPercentage += simulatePlayerResult.stand.winPercentage;
		result.stand.losePercentage += simulatePlayerResult.stand.losePercentage;
		result.stand.drawPercentage += simulatePlayerResult.stand.drawPercentage;
		result.hit.winPercentage += simulatePlayerResult.hit.winPercentage;
		result.hit.losePercentage += simulatePlayerResult.hit.losePercentage;
		result.hit.drawPercentage += simulatePlayerResult.hit.drawPercentage;
		result.totalChance = 1;
	});
	
	return result;
}

function simulatePlayer(playerHand, dealerHand, shoe, parentNode, totalChance, level, firstPlayerAction) {
	var nextLevel = level + 1;
	var result = {
		stand: {
			winPercentage: 0,
			losePercentage: 0,
			drawPercentage: 0
		},
		hit: {
			winPercentage: 0,
			losePercentage: 0,
			drawPercentage: 0
		},
		totalChance: totalChance
	};
	var hitResult = {};
	var totalHitResult = {
		winPercentage: 0,
		losePercentage: 0,
		drawPercentage: 0
	};
	var betterResult;
	
	parentNode.turn = PLAYER;
	
	// stand
	parentNode.stand = {
		playerHand: playerHand,
		dealerHand: dealerHand
	};
	if (!firstPlayerAction) {
		result.stand = simulateDealer(playerHand, dealerHand, shoe, parentNode.stand, totalChance, nextLevel, STAND);
	} else {
		result.stand = simulateDealer(playerHand, dealerHand, shoe, parentNode.stand, totalChance, nextLevel, firstPlayerAction);
	}
	
	// hit
	parentNode.hit = {};
	config.cardList.forEach(card => {
		var newShoe = util.copyShoe(shoe);
		var newPlayerHand = util.copyHand(playerHand);
		var chanceToDraw = drawCard(card, newShoe);
		
		newPlayerHand.cards.push(card);		
		newPlayerHand.points = getHandValue(newPlayerHand);
		
		hit = {
			chance: chanceToDraw,
			totalChance: totalChance * chanceToDraw,
			playerHand: newPlayerHand,
			dealerHand: dealerHand
		};
		
		if (hit.totalChance > 0) {
			if (newPlayerHand.points > 21) {
				// busted
				hit.result = LOSE;
				
				// round over
				if (!firstPlayerAction) {
					roundOverSaveStats(HIT, LOSE, hit.totalChance, newPlayerHand, dealerHand);
				} else {
					roundOverSaveStats(firstPlayerAction, LOSE, hit.totalChance, newPlayerHand, dealerHand);
				}
				
				hitResult = {
					winPercentage: 0,
					losePercentage: hit.totalChance,
					drawPercentage: 0
				};
				
			} else {
				// simulate Player again
				if (!firstPlayerAction) {
					hitResult = simulatePlayer(newPlayerHand, dealerHand, newShoe, hit, hit.totalChance, nextLevel, HIT);
				} else {
					hitResult = simulatePlayer(newPlayerHand, dealerHand, newShoe, hit, hit.totalChance, nextLevel, firstPlayerAction);
				}
			}
			
			result.hit[card] = hitResult;
			result.hit[card].totalChance = hit.totalChance;
			totalHitResult = accumulateResult(totalHitResult, hitResult);
		}
		
		parentNode.hit[card] = hit;
	});
	betterResult = getBetterChances(result.stand, totalHitResult);
	
	result.hit.winPercentage = totalHitResult.winPercentage;
	result.hit.losePercentage = totalHitResult.losePercentage;
	result.hit.drawPercentage = totalHitResult.drawPercentage;
	
	result.winPercentage = betterResult.winPercentage;
	result.losePercentage = betterResult.losePercentage;
	result.drawPercentage = betterResult.drawPercentage;
	
	return result;
}

function simulateDealer(playerHand, dealerHand, shoe, parentNode, totalChance, level, firstPlayerAction) {
	var nextLevel = level + 1;
	var result = {
		winPercentage: 0,
		losePercentage: 0,
		drawPercentage: 0
	};
	
	parentNode.turn = DEALER;
	if (dealerHand.points > 21) {
		// busted
		parentNode.result = WIN;
		
		// round over
		roundOverSaveStats(firstPlayerAction, WIN, totalChance, playerHand, dealerHand);
		
		result = getResult(WIN, totalChance);
		
	} else if (dealerHand.points >= 17) {
		// stand
		
		parentNode.stand = {
			result: determineResult(playerHand, dealerHand),
			totalChance: totalChance
		};
		
		// round over
		roundOverSaveStats(firstPlayerAction, parentNode.stand.result, totalChance, playerHand, dealerHand);
	
		result = getResult(parentNode.stand.result, totalChance);
		
	} else {
		// hit
		parentNode.hit = {};
		config.cardList.forEach(card => {
			var newShoe = util.copyShoe(shoe);
			var newDealerHand = util.copyHand(dealerHand);
			var chanceToDraw = drawCard(card, newShoe);
			
			newDealerHand.cards.push(card);		
			newDealerHand.points = getHandValue(newDealerHand);
			
			hit = {
				chance: chanceToDraw,
				totalChance: totalChance * chanceToDraw,
				playerHand: playerHand,
				dealerHand: newDealerHand
			};
			parentNode.hit[card] = hit;
			
			result = accumulateResult(result, simulateDealer(playerHand, newDealerHand, newShoe, hit, hit.totalChance, nextLevel, firstPlayerAction));
		});
	}
	
	return result;
}

function accumulateResult(result, singleResult) {
	return {
		winPercentage: result.winPercentage + singleResult.winPercentage,
		losePercentage: result.losePercentage + singleResult.losePercentage,
		drawPercentage: result.drawPercentage + singleResult.drawPercentage
	};
}

function getBetterChances(stand, hit) {
	switch (config.goal) {
		case "lowestLoseChance":
			if (stand.losePercentage === hit.losePercentage) {
				if (stand.winPercentage > hit.winPercentage) {
					return stand;
				}
				return hit;
			}
			if (stand.losePercentage < hit.losePercentage) {
				return stand;
			}
			return hit;
		case "highestWinChance":
			if (stand.winPercentage === hit.winPercentage) {
				if (stand.losePercentage < hit.losePercentage) {
					return stand;
				}
				return hit;
			}
			if (stand.winPercentage > hit.winPercentage) {
				return stand;
			}
			return hit;
	}
}

function getResult(result, chance) {
	return {
		winPercentage: result === WIN ? chance : 0,
		losePercentage: result === LOSE ? chance : 0,
		drawPercentage: result === DRAW ? chance : 0
	};
}

function roundOverSaveStats(playerAction, result, chance, playerHand, dealerHand) {
	if (chance <= 0) {
		return;
	}
	
	var actionStats,
		resultStats,
		resultObject = {
			chance: chance,
			playerHand: playerHand,
			dealerHand: dealerHand
		};
	
	switch (playerAction) {
		case STAND:
			actionStats = stats.actions.stand;
			resultStats = stats.results.stand;
			break;
		case HIT:
			actionStats = stats.actions.hit;
			resultStats = stats.results.hit;
			break;
	}
	switch (result) {
		case WIN:
			actionStats.wins++;
			actionStats.winPercentage += chance;
			resultStats.wins.push(resultObject);
			break;
		case LOSE:
			actionStats.losses++;
			actionStats.losePercentage += chance;
			resultStats.losses.push(resultObject);
			break;
		case DRAW:
			actionStats.draws++;
			actionStats.drawPercentage += chance;
			resultStats.draws.push(resultObject);
			break;
	}
}

function drawCard(cardName, shoe) {
	var card = shoe.cards[cardName];
	var chanceToDraw = card.chanceToDraw;
	if (card.count > 0) {
		card.count--;
		shoe.countCards--;
	}
	updateChanceToDraw(shoe);
	return chanceToDraw;
}

function initShoe(removedCards) {
	var shoe = {
		cards: {},
		countCards: 0
	};
	var key;
	
	for (key in config.cards) {
		shoe.cards[key] = {
			count: config.cards[key].count
		};
		shoe.countCards += config.cards[key].count;
	}
		
	removedCards.forEach(item => drawCard(item, shoe));
	
	updateChanceToDraw(shoe);
	
	return shoe;
}

function updateChanceToDraw(shoe) {
	for (key in shoe.cards) {
		shoe.cards[key].chanceToDraw = shoe.cards[key].count / shoe.countCards;
	}
}

function getHandValue(hand) {
	var cards = hand.cards;
	var value = 0,
		countAces = 0;	
	cards.forEach(card => {
		if (card === "A") {
			countAces++;
		}
		value += config.cards[card].value;
	});
	while (value > 21 && countAces > 0) {
		value -= 10;
		countAces--;
	}
	return value;
}

function determineResult(playerHand, dealerHand) {
	if (playerHand.points > 21) {
		return LOSE;
	}
	if (dealerHand.points > 21) {
		return WIN;
	}
	if (playerHand.points > dealerHand.points) {
		return WIN;
	}
	if (playerHand.points < dealerHand.points) {
		return LOSE;
	}
	return DRAW;
}