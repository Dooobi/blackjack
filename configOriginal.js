var _numberOfDecks = 1;

module.exports = {
	startingPlayerHand: { cards: ["5", "10"], points: 15 },
	startingDealerHand: { cards: ["8"], points: 8 },
	numberOfDecks: _numberOfDecks,
	cardList: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],
	cards: {
		"2": {
			value: 2,
			count: _numberOfDecks * 4
		},
		"3": {
			value: 3,
			count: _numberOfDecks * 4
		},
		"4": {
			value: 4,
			count: _numberOfDecks * 4
		},
		"5": {
			value: 5,
			count: _numberOfDecks * 4
		},
		"6": {
			value: 6,
			count: _numberOfDecks * 4
		},
		"7": {
			value: 7,
			count: _numberOfDecks * 4
		},
		"8": {
			value: 8,
			count: _numberOfDecks * 4
		},
		"9": {
			value: 9,
			count: _numberOfDecks * 4
		},
		"10": {
			value: 10,
			count: _numberOfDecks * 4
		},
		"J": {
			value: 10,
			count: _numberOfDecks * 4
		},
		"Q": {
			value: 10,
			count: _numberOfDecks * 4
		},
		"K": {
			value: 10,
			count: _numberOfDecks * 4
		},
		"A": {
			value: 11,	// or 1
			count: _numberOfDecks * 4
		}
	}
};
