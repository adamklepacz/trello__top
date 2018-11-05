import React, { Component } from 'react';
import Board from 'react-trello';
import CustomCard from './components/CustomCard';
import NewCustomCard from './components/NewCustomCard';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.setInitDataToLocalStorage();
    this.state = {
      data: this.getCurrentData(),
      laneTitle: '',
      currentlyDraggedCard: '',
      currentlyDraggedCardIndex: '',
      currentLaneIndex: '',
      currentLaneId: '',
      newTaskTitle: '',
      newTaskDue: '',
      newTaskBody: '',
    };
  }

  setInitDataToLocalStorage = () => {
    const data = {
      lanes: [{
        id: 'lane1',
        title: 'Custom trello backlog',
        cards: [{
            id: 'Card1',
            name: 'Develop a landing page',
            dueOn: '01-09-2018',
            body: 'Please develop a landing page of this app. A fancy one!'
          },
          {
            id: 'Card2',
            name: 'Develop a login page',
            dueOn: '23-09-2018',
            body: 'Login page InVision file is under this link: bit.ly! Have fun!'
          },
        ],
      },
      {
        id: 'lane2',
        title: 'To-do',
        cards: [{
            id: 'Card1',
            name: 'Develop a contact page',
            dueOn: '01-09-2018',
            body: 'Please develop a contact page of this app.'
          },
        ],
      }],
    };

    const currentData = JSON.parse(localStorage.getItem('data'));

    if (!currentData) {
      localStorage.setItem('data', JSON.stringify(data));
    }
  }

  getCurrentData = () => {
    const data = JSON.parse(localStorage.getItem('data'));
    return data;
  }

  updateData = (data) => {
    localStorage.setItem('data', JSON.stringify(data));

    this.setState({
      data: this.getCurrentData(),
    });
  }

  addCard = (card, laneId) => {
    const data = this.getCurrentData();
    const {lanes} = data;

    lanes.map((current) => {
      const laneIndex = laneId.match(/\d/g).join('') - 1;

      if (current.id === laneId) {
        data.lanes[laneIndex].cards.push(card);
      }

      this.updateData(data);
      return data;
    });
  }

  moveCard = (cardID, targetLaneId, position) => {
    const data = this.getCurrentData();
    const currentLaneIndex = targetLaneId.match(/\d/g).join('') - 1;
    const nextLaneIndex = position.match(/\d/g).join('') - 1;

    // save current card to state
    data.lanes[currentLaneIndex].cards.map((currentCard, index) => {
      if (cardID === currentCard.id) {
        this.setState({
          currentlyDraggedCard: currentCard,
          currentlyDraggedCardIndex: index,
          currentLaneIndex,
        });
      }
      return currentCard;
    });

    // check if sourceLane is diffrent from current lane
    if (targetLaneId !== position) {
      data.lanes[currentLaneIndex].cards.splice(this.state.currentlyDraggedCardIndex, 1);
      data.lanes[nextLaneIndex].cards.push(this.state.currentlyDraggedCard);

      this.updateData(data);
    }
  }

  addLane = (e) => {
    e.preventDefault();
    const data = this.getCurrentData();
    const nextItemIndex = data.lanes.length;
    const newLaneId = `lane${nextItemIndex + 1}`;
    const newLaneTitle = this.state.laneTitle.length > 0 ? this.state.laneTitle : 'New list';

    data.lanes[nextItemIndex] = {
      id: newLaneId,
      title: newLaneTitle,
      cards: [],
    };

    this.updateData(data);

    // reset form
    this.setState({
      laneTitle: '',
    });
  }

  updateLaneTitle = (e) => {
    this.setState({
      laneTitle: e.target.value,
    });
  }

  handleLaneClick = (laneId) => {
    this.setState({
      currentLaneId: laneId,
    });
  }

  handleNewTaskData = (newTaskData) => {
    const {currentLaneId} = this.state;

    this.addCard(newTaskData, currentLaneId);
  }

  render() {
    const { data, currentLaneId } = this.state;
   
    return (
      <div>
        <form
          className="lane-form"
          onSubmit={e => this.addLane(e)}
        >
          <input
            type="text"
            placeholder="Set new lane title"
            value={this.state.laneTitle}
            onChange={e => this.updateLaneTitle(e)}
            required
            maxLength="30"
            className="lane-form__input"
          />
            <button type="submit" className="lane-form__submit">Create new lane</button>
        </form>
          <Board
            data={data}
            customCardLayout
            draggable
            cardDraggable
            editable
            onCardAdd={(card, laneId) => this.addCard(card, laneId)}
            onCardClick={(cardID, metadata, laneId) => this.handleLaneClick(cardID, metadata, laneId)}
            handleDragEnd = {(cardID, targetLaneId, position, cardDetails) => this.moveCard(cardID, targetLaneId, position, cardDetails)}
            newCardTemplate={<NewCustomCard />}
            onLaneClick={(laneId) => {this.handleLaneClick(laneId)}}
          >
            <CustomCard lane={currentLaneId} />
          </Board>
      </div>
    );
  }
}

export default App;
