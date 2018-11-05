import React, { Component } from 'react';
import todaysDate from '../utils/CurrentDate';


class NewCustomCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isTaskOverdue: '',
      isThreeDaysToDue: '',
      today: todaysDate,
    };
  }

  updateField = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleAdd = (e) => {
    e.preventDefault();
    this.props.onAdd(this.state);
  }

  render() {
    return (
      <div className="custom-card">
        <form className="custom-card__form" onSubmit={this.handleAdd}>
          <div className="custom-card__form-content">
            <input
              className="custom-card__input"
              type="text"
              placeholder="Title"
              name="name"
              required
              onChange={(e) => { this.updateField(e) }}
            />
              <input
                className="custom-card__date"
                type="date"
                name="dueOn"
                onChange={(e) => { this.updateField(e) }}
              />
          </div>

            <textarea 
              className="custom-card__textarea"
              type="text"
              placeholder="Description"
              name="body"
              required
              onChange={(e) => { this.updateField(e) }}
            />
              <div className="custom-card__buttons">
                <button className="custom-card__submit" type="submit">Add</button>
                  <button className="custom-card__cancel">Cancel</button>
              </div>
        </form>
      </div>
    );
  }
}

export default NewCustomCard;
