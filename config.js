var _numberOfDecks = 2;
var HIGHEST_WIN_CHANCE = "highestWinChance",
	LOWEST_LOSE_CHANCE = "lowestLoseChance";
	
module.exports = {
	goal: LOWEST_LOSE_CHANCE,
	startingPlayerHand: { cards: ["7", "7"], points: 14 },
	startingDealerHand: { cards: ["7"], points: 7 },
	numberOfDecks: _numberOfDecks,
	cardList: ["7"],
	cards: {
		"7": {
			value: 7,
			count: _numberOfDecks * 4
		}
		/*,
		"10": {
			value: 10,
			count: _numberOfDecks * 4
		}
		*/
	}
};
