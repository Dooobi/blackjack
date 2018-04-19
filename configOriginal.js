var _numberOfDecks = 1;
var HIGHEST_WIN_CHANCE = "highestWinChance",
	LOWEST_LOSE_CHANCE = "lowestLoseChance";
	
module.exports = {
	goal: LOWEST_LOSE_CHANCE,
	startingPlayerHand: { cards: ["10", "2"], points: 12 },
	startingDealerHand: { cards: ["5"], points: 5 },
	numberOfDecks: _numberOfDecks,
	cardList: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],
	cards: {
		"2": {
			value: 2,
			count: 4
		},
		"3": {
			value: 3,
			count: 4
		},
		"4": {
			value: 4,
			count: 4
		},
		"5": {
			value: 5,
			count: 4
		},
		"6": {
			value: 6,
			count: 4
		},
		"7": {
			value: 7,
			count: 4
		},
		"8": {
			value: 8,
			count: 4
		},
		"9": {
			value: 9,
			count: 4
		},
		"10": {
			value: 10,
			count: 4
		},
		"J": {
			value: 10,
			count: 4
		},
		"Q": {
			value: 10,
			count: 4
		},
		"K": {
			value: 10,
			count: 4
		},
		"A": {
			value: 11,	// or 1
			count: 4
		}
	}
};
