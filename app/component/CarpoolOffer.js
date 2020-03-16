import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape } from 'react-intl';
import { routerShape } from 'react-router';
import Icon from './Icon';
import Checkbox from './Checkbox';

/** variables in return section:
 *  - time
 *  - from, to
 *  - selected days
 *
 */

export default class CarpoolOffer extends React.Component {
  // duration, from, to, start

  static contextTypes = {
    intl: intlShape.isRequired,
    router: routerShape.isRequired,
    location: PropTypes.shape({
      params: PropTypes.shape({
        from: PropTypes.string,
        to: PropTypes.string,
      }),
      query: PropTypes.shape({
        time: PropTypes.number,
      }),
    }),
    config: PropTypes.object.isRequired,
  };

  static propTypes = {
    onToggleClick: PropTypes.func.isRequired,
    from: PropTypes.string,
    to: PropTypes.string,
    start: PropTypes.number,
  };

  days = {
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
    sun: false,
  };

  isRegularly = false;

  selectedDays = [];

  isFinished = false;

  setFrequency = e => {
    e.preventDefault();
    this.isRegularly = document.getElementById('regularly').checked;
    this.forceUpdate();
  };

  updateSelectedDays = day => {
    if (this.selectedDays.includes(day)) {
      this.selectedDays.splice(this.selectedDays.indexOf(day), 1);
    } else {
      this.selectedDays.push(day);
    }
  };

  finishForm = e => {
    e.preventDefault();
    this.isFinished = true;
    this.forceUpdate();
  };

  getOfferedTimes = () => {
    let tmp = '';
    for (let i = 0; i < this.selectedDays.length; i++) {
      tmp = tmp.concat(this.selectedDays[i]).concat('s, ');
    }
    tmp = tmp
      .replace(/D/g, 'd')
      .replace(/M/g, 'm')
      .replace(/T/g, 't')
      .replace(/F/g, 'f')
      .replace(/S/g, 's')
      .replace(/W/g, 'w');
    tmp = '- '.concat(tmp);
    tmp = tmp.replace(/,(?=[^,]*$)/, '');
    const tmp2 = this.props.start;
    tmp = tmp
      .concat(' um ')
      .concat(tmp2)
      .concat(' Uhr.');
    return tmp;
  };

  render() {
    const origin = this.props.from;
    const destination = this.props.to;
    const { onToggleClick } = this.props;
    const offeredTimes = this.getOfferedTimes();

    return (
      <div className="customize-search carpool-offer">
        <button className="close-offcanvas" onClick={onToggleClick}>
          <Icon className="close-icon" img="icon-icon_close" />
        </button>
        <Icon className="fg_icon" img="fg_icon" width={12} height={12} />
        {this.isFinished ? (
          <div className="sidePanelText">
            <h2>
              <FormattedMessage id="thank-you" defaultMessage="Thank you" />
            </h2>
            <p>
              <FormattedMessage
                id="carpool-offer-success"
                values={{ origin, destination }}
                defaultMessage="Your offer from {origin} to {destination} was added."
              />
              <br />
              {this.isRegularly ? (
                <FormattedMessage
                  id="chosen-times-recurring"
                  defaultMessage="You've set the following times and days:"
                />
              ) : (
                <FormattedMessage
                  id="chosen-times-once"
                  defaultMessage="You've set the following time:"
                />
              )}
              <br />
              {offeredTimes}
            </p>
            <button
              type="submit"
              className="sidePanel-btn"
              onClick={() => {
                this.isFinished = false;
                this.isRegularly = false;
                this.forceUpdate();
              }}
            >
              <FormattedMessage id="close" defaultMessage="Close" />
            </button>
          </div>
        ) : (
          <div className="sidePanelText">
            <h2>
              <FormattedMessage
                id="your-carpool-trip"
                defaultMessage="Your trip"
              />
            </h2>
            <p>
              <b>
                <FormattedMessage id="origin" defaultMessage="Origin" />
              </b>: {this.props.from}{' '}
              <FormattedMessage id="at-time" defaultMessage="at" />{' '}
              {this.props.start}
              <br />
              <b>
                <FormattedMessage id="destination" defaultMessage="Destination" />
              </b>: {this.props.to}
            </p>
            <p>
              <FormattedMessage
                id="add-carpool-offer-frequency"
                defaultMessage="How often do you want to add the offer?"
              />
            </p>
            <form onSubmit={this.setFrequency}>
              <div>
                <input
                  type="radio"
                  id="once"
                  value="once"
                  name="times"
                  defaultChecked
                />
                <label className="radio-label" htmlFor="once">
                  <FormattedMessage id="once" defaultMessage="once" />
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="regularly"
                  value="regularly"
                  name="times"
                />
                <label className="radio-label" htmlFor="regularly">
                  <FormattedMessage id="recurring" defaultMessage="recurring" />
                </label>
              </div>
              <input
                className="sidePanel-btn"
                type="submit"
                value={this.isRegularly ? 'Update' : 'Next'}
              />
            </form>
            {this.isRegularly ? (
              <form onSubmit={this.finishForm}>
                <Checkbox
                  onChange={e => {
                    this.updateSelectedDays(
                      e.currentTarget.getAttribute('aria-label'),
                    );
                    this.days.mon = !this.days.mon;
                    this.forceUpdate();
                  }}
                  checked={this.days.mon}
                  labelId="monday"
                  title="mon"
                />
                <Checkbox
                  checked={this.days.tue}
                  onChange={e => {
                    this.updateSelectedDays(
                      e.currentTarget.getAttribute('aria-label'),
                    );
                    this.days.tue = !this.days.tue;
                    this.forceUpdate();
                  }}
                  labelId="tuesday"
                />
                <Checkbox
                  checked={this.days.wed}
                  onChange={e => {
                    this.updateSelectedDays(
                      e.currentTarget.getAttribute('aria-label'),
                    );
                    this.days.wed = !this.days.wed;
                    this.forceUpdate();
                  }}
                  labelId="wednesday"
                />
                <Checkbox
                  checked={this.days.thu}
                  onChange={e => {
                    this.updateSelectedDays(
                      e.currentTarget.getAttribute('aria-label'),
                    );
                    this.days.thu = !this.days.thu;
                    this.forceUpdate();
                  }}
                  labelId="thursday"
                />
                <Checkbox
                  checked={this.days.fri}
                  onChange={e => {
                    this.updateSelectedDays(
                      e.currentTarget.getAttribute('aria-label'),
                    );
                    this.days.fri = !this.days.fri;
                    this.forceUpdate();
                  }}
                  labelId="friday"
                />
                <Checkbox
                  checked={this.days.sat}
                  onChange={e => {
                    this.updateSelectedDays(
                      e.currentTarget.getAttribute('aria-label'),
                    );
                    this.days.sat = !this.days.sat;
                    this.forceUpdate();
                  }}
                  labelId="saturday"
                />
                <Checkbox
                  checked={this.days.sun}
                  onChange={e => {
                    this.updateSelectedDays(
                      e.currentTarget.getAttribute('aria-label'),
                    );
                    this.days.sun = !this.days.sun;
                    this.forceUpdate();
                  }}
                  labelId="sunday"
                />
                <div>
                  <input className="sidePanel-btn" type="submit" value="Next" />
                </div>
              </form>
            ) : (
              ''
            )}
          </div>
        )}
      </div>
    );
  }
}
