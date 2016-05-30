import React from 'react';

const Rules = React.createClass({
	render: function() {
	const className = !this.props.state.rules ? 'info hidden' : 'info',
		infoText = !this.props.state.rules ? 'Show rules' : 'Hide rules';

	return (
		<div className="rules">
	<span className="rules-toggle" onClick={this.props.toggleRules}>{infoText}</span>
<p className={className}>
Try to guess the pattern, in both order and color, within ten turns. After submitting a row, a small black peg is placed for each code peg from the guess which is correct in both color and position. A white peg indicates the existence of a correct color code peg placed in the wrong position. More info on <a href="https://en.wikipedia.org/wiki/Mastermind_(board_game)" target="_blank">Wikipedia</a>.
</p>
</div>
);
}
});

const Peg = React.createClass({
	render: function() {
	return (
		<span className={this.props.pegClass}>
<input type='radio' name={this.props.name} value={this.props.value} id={this.props.idVal} onClick={this.props.isCurrentRow ? this.props.activatePeg : null}/>
<label htmlFor={this.props.idVal}></label>
</span>
);
}
});

const DecodeRow = React.createClass({
	//do not update already submitted row
	shouldComponentUpdate: function(nextProps) {
	return nextProps.state.currentRow <= nextProps.rowId ? true : false;
},

render: function() {
	let pegs = [],
		i,
		idVal,
		pegClass;

	for (i = 1; i <= this.props.state.pegsInRow; i++) {
		idVal = this.props.name + '-' + i;
		//update current row
		if (this.props.state.currentRow === this.props.rowId) {
			pegClass = this.props.state.currentGuess.get(i - 1) ? 'peg ' + this.props.state.currentGuess.get(i - 1) : 'peg';
		} else { //clear all of the next pegs - from the previous game
			pegClass = 'peg';
		}

		pegs.push(<Peg idVal={idVal} name={this.props.name} value={i} key={idVal} pegClass={pegClass} isCurrentRow={this.props.isCurrentRow} activatePeg={this.props.activatePeg}/>);
}

return (
	<div className='decode-row'>
{pegs}
</div>
);
}
});

const SubmitButton = React.createClass({
		render: function() {
			const className = (this.props.state.currentGuess.size >= this.props.state.pegsInRow && this.props.state.currentRow === this.props.rowId)  ? 'submit' : 'submit hidden';

			return (
				<button className={className} onClick={this.props.submitPegs}></button>
);
}
});

const Row = React.createClass({
	render: function() {
	const isCurrentRow = this.props.state.currentRow === this.props.rowId,
		rowClassName = isCurrentRow ? 'row clearfix current' : 'row clearfix',
		hintsRowName = 'hintsRow-' + this.props.rowId,
		rowName ='decodeRow-' + this.props.rowId;

	return (
		<div className={rowClassName}>
	<div className='left'>
	<DecodeRow name={rowName} key={this.props.rowId} rowId={this.props.rowId} state={this.props.state} isCurrentRow={isCurrentRow} activatePeg={this.props.activatePeg}/>
</div>
<div className='left'>
<SubmitButton rowId={this.props.rowId} state={this.props.state} submitPegs={this.props.submitPegs}/>
</div>
<div className='right'>
<HintsRow name={hintsRowName} key={this.props.rowId} rowId={this.props.rowId} state={this.props.state}/>
</div>
</div>
);
}
});

const Hint = React.createClass({
		shouldComponentUpdate: function(nextProps) {
			return nextProps.state.currentRow - 1 <= nextProps.rowId ? true : false;
		},

		render: function() {
			return (
				<span className={this.props.hintClass}>
		</span>
);
}
});

const HintsRow = React.createClass({
	render: function() {
		const hints = [];

		let idVal,
			hintClass = '',
			exactMatches = this.props.state.exactMatches,
			valueMatches = this.props.state.valueMatches;

		for (let i = 1; i <= this.props.state.pegsInRow; i++) {
			hintClass = 'hint';
			idVal = this.props.name + '-' + i;

			//update current row
			if (this.props.state.currentRow - 1 === this.props.rowId) {
				if (exactMatches > 0) {
					hintClass = hintClass + ' exact-matches';
					exactMatches--;
				} else if (valueMatches > 0) {
					hintClass = hintClass + ' value-matches';
					valueMatches--;
				}
			}

			hints.push(<Hint key={idVal} hintClass={hintClass} rowId={this.props.rowId} state={this.props.state}/>);
}

return (
	<div className="hints-row">
{hints}
</div>
);
}
});

const DecodingBoard = React.createClass({
	render: function() {
	let rows = [],
		i,
		rowName;

	for (i=1; i <= this.props.state.attempts; i++) {
		rowName = 'decodeRow-' + i;
		rows.push(<Row name={rowName} key={i} rowId={i-1} state={this.props.state} activatePeg={this.props.activatePeg} submitPegs={this.props.submitPegs}/>);
}

return (
	<div className="decoding-board left">
{rows}
</div>
);
}
});

const CodePegs = React.createClass({
	render: function() {
		const pegs = [];

		let idVal,
			pegClass;

		for (let [key, value] of this.props.colors) {
			idVal = 'peg-' + key; //if there is no key in the newest react, remove this value
			pegClass = 'peg ' + value;
			if (value === this.props.state.selectedPeg) {
				pegClass = pegClass + ' selected';
			}
			pegs.push(<Peg idVal={idVal} name='peg' value={value} key={idVal} pegClass={pegClass} activatePeg={this.props.activatePeg} isCurrentRow={true}/>);
	}

	return (
<div className='codepegs right'>
{pegs}
</div>
);
}
});

const EndGame = React.createClass({
	render: function() {
		const endGameInfo = this.props.state.endGame ? 'endgame' : 'endgame hidden',
			endGameStatus = this.props.state.success ? 'endgame-relative success' : 'endgame-relative failure',
			infoText = this.props.state.success ? 'Congratulations!' : 'GAME OVER!';

		return (
			<div className={endGameInfo}>
		<div className={endGameStatus}>
		<h2 className="endgame-header">{infoText}</h2>
		<button className="endgame-btn" onClick={this.props.reloadGame}>PLAY AGAIN</button>
</div>
<div className="endgame-relative endgame-overlay"></div>
</div>
);
}
});

const Mastermind = React.createClass({
	getInitialState: function() {
	return {
		code: this.generateCode(), //the main code to be decoded
		selectedPeg: this.props.colors.get(0),
		currentRow: 0,
		currentGuess: new Map(),
		exactMatches: 0,
		valueMatches: 0,
		pegsInRow: 4,
		attempts: 10,
		rules: false,
		success: false,
		endGame: false
	};
},

reloadGame: function() {
	this.setState({ success: false });
	this.setState({ endGame: false });
	this.setState({ code: this.generateCode() });
	this.setState({ selectedPeg: this.props.colors.get(0) });
	this.setState({ currentRow: 0 });
	this.setState({ currentGuess: new Map() });
	this.setState({ exactMatches: 0 });
	this.setState({ valueMatches: 0 });
},

toggleRules: function() {
	this.setState({ rules: !this.state.rules });
},

getRandomArbitrary: function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
},

generateCode: function() {
	const code = new Map();

	for (let i = 0; i < this.props.codeLength; i++) {
		code.set(i, this.props.colors.get(this.getRandomArbitrary(0, 5)));
	}

	return code;
},

activatePeg: function(event) { //The stateful component encapsulates all of the interaction logic
	//if one of the peg on the right was selected
	if (event.target.name.startsWith('peg')) {
		this.setState({ selectedPeg: event.target.value });
	} else {
		//else if one of the pegs on decoding board was selected
		if (this.state.selectedPeg) { //if peg on the right was selected
			this.setState({ currentGuess: this.state.currentGuess.set(event.target.value - 1, this.state.selectedPeg) });
		}
	}
},

keyOf: function(map, valueToFind) {
	for (let [key, value] of map) {
		if (valueToFind === value) {
			return key;
		}
	}

	return -1;
},

submitPegs: function() {
	let code = new Map(this.state.code),
		pegs = this.state.currentGuess,
		foundKey,
		exactMatches = 0,
		valueMatches = 0;

	// First pass: Look for value & position matches
	// Safely remove items if they match
	for (let [key, value] of pegs) {
		if (value === code.get(key)) {
			exactMatches++;
			pegs.delete(key);
			code.delete(key);
		}
	}

	// Second pass: Look for value matches anywhere in the code
	for (let [key, value] of pegs) {
		// attempt to find the peg in the remaining code
		foundKey = this.keyOf(code, value);
		if (foundKey !== -1) {
			valueMatches++;
			// remove the matched code peg, since it's been matched
			code.delete(foundKey);
		}
	}

	if (exactMatches === this.state.pegsInRow) {
		this.setState({ endGame: true });
		this.setState({ success: true });
	} else if (this.state.attempts === this.state.currentRow + 1) {
		this.setState({ endGame: true });
	}

	this.setState({exactMatches: exactMatches});
	this.setState({valueMatches: valueMatches});
	this.setState({currentRow: this.state.currentRow + 1});
	this.setState({currentGuess: new Map()});
},

render: function() {
	return (
		<div>
		<h1><span className="M">M</span><span className="A">A</span><span className="S">S</span><span className="T">T</span><span className="E">E</span><span className="R">R</span><span className="MIND">MIND</span></h1>
	<Rules state={this.state} toggleRules={this.toggleRules}/>

<div className="clearfix">
<DecodingBoard state={this.state} activatePeg={this.activatePeg} submitPegs={this.submitPegs}/>
<CodePegs state={this.state} colors={this.props.colors} activatePeg={this.activatePeg}/>
</div>

<EndGame state={this.state} reloadGame={this.reloadGame}/>
<div className="cheat">{this.state.code}</div>
</div>
);
}
});

export default Mastermind