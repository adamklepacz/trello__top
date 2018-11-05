import React, { Component } from 'react';
import * as moment from 'moment';

class CustomCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dueOn: props.dueOn,
      today: props.today,
      isThreeDaysToDue: false,
      isTaskOverdue: false,
    };
  }

   componentDidMount() {
     this.checkCardDueDate();
   }

  checkCardDueDate = () => {
    if (this.state.dueOn !== undefined) {
      const isThreeDaysToDue = moment(this.state.dueOn).subtract(3, 'days').isSameOrBefore(moment());
      const isTaskOverdue = moment(this.state.dueOn).isBefore(moment());

      this.setState({
        isThreeDaysToDue,
        isTaskOverdue,
      }, () => {
        this.render();
      });
    }
  }

  render() {
    const { isTaskOverdue, isThreeDaysToDue } = this.state;
    const { name, dueOn, body } = this.props;
    return (
      <div className={"task " + (isTaskOverdue ? 'red-card ' : '') + (isThreeDaysToDue ? 'yellow-card' : '')}>
        <header className="task__header">
          <div className="task__name">{name}</div>
            <div className="task__due">{dueOn}</div>
        </header>
          <div className="task__body">
            <div className="task__body-content">
              <i>{body}</i>
            </div>
          </div>
      </div>
    );
  }
}

export default CustomCard;
