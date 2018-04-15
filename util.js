module.exports = {
	copyHand: function(hand) {
		return {
			cards: hand.cards.concat(),
			points: hand.points
		}
	},
	copyShoe: function(shoe) {
		return JSON.parse(JSON.stringify(shoe));
	},
	copyShoe2: function(shoe) {
		var cards = shoe.cards;
		return {
			countCards: shoe.countCards,
			cards: {
				"2": {
					count: cards["2"].count,
					chanceToDraw: cards["2"].chanceToDraw
				},
				"3": {
					count: cards["3"].count,
					chanceToDraw: cards["3"].chanceToDraw
				},
				"4": {
					count: cards["4"].count,
					chanceToDraw: cards["4"].chanceToDraw
				},
				"5": {
					count: cards["5"].count,
					chanceToDraw: cards["5"].chanceToDraw
				},
				"6": {
					count: cards["6"].count,
					chanceToDraw: cards["6"].chanceToDraw
				},
				"7": {
					count: cards["7"].count,
					chanceToDraw: cards["7"].chanceToDraw
				},
				"8": {
					count: cards["8"].count,
					chanceToDraw: cards["8"].chanceToDraw
				},
				"9": {
					count: cards["9"].count,
					chanceToDraw: cards["9"].chanceToDraw
				},
				"10": {
					count: cards["10"].count,
					chanceToDraw: cards["10"].chanceToDraw
				},
				"J": {
					count: cards["J"].count,
					chanceToDraw: cards["J"].chanceToDraw
				},
				"Q": {
					count: cards["Q"].count,
					chanceToDraw: cards["Q"].chanceToDraw
				},
				"K": {
					count: cards["K"].count,
					chanceToDraw: cards["K"].chanceToDraw
				},
				"A": {
					count: cards["A"].count,
					chanceToDraw: cards["A"].chanceToDraw
				}
			}
		}
	}
};
