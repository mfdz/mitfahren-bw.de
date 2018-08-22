import PropTypes from 'prop-types';
import React from 'react';
import get from 'lodash/get';
import { intlShape } from 'react-intl';
import { routerShape } from 'react-router';

import { StreetMode } from '../constants';
import Icon from './Icon';
import FareZoneSelector from './FareZoneSelector';
import PreferredRoutes from './PreferredRoutes';
import ResetCustomizedSettingsButton from './ResetCustomizedSettingsButton';
import SaveCustomizedSettingsButton from './SaveCustomizedSettingsButton';
import StreetModeSelectorPanel from './StreetModeSelectorPanel';
import BikeTransportOptionsSection from './customizesearch/BikeTransportOptionsSection';
import BikingOptionsSection from './customizesearch/BikingOptionsSection';
import RoutePreferencesSection from './customizesearch/RoutePreferencesSection';
import SelectOptionContainer from './customizesearch/SelectOptionContainer';
import TransferOptionsSection from './customizesearch/TransferOptionsSection';
import TransportModesSection from './customizesearch/TransportModesSection';
import WalkingOptionsSection from './customizesearch/WalkingOptionsSection';
import {
  getCustomizedSettings,
  resetCustomizedSettings,
} from '../store/localStorage';
import * as ModeUtils from '../util/modeUtils';
import { getDefaultSettings } from '../util/planParamUtil';
import { replaceQueryParams } from '../util/queryUtils';

class CustomizeSearch extends React.Component {
  static contextTypes = {
    intl: intlShape.isRequired,
    router: routerShape.isRequired,
    location: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
  };

  static propTypes = {
    isOpen: PropTypes.bool,
    onToggleClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isOpen: false,
  };

  onRouteSelected = (val, preferType) => {
    const routeToAdd = val.properties.gtfsId.replace(':', '__');
    const currentRoutes = this.getCurrentRoutes(preferType);

    let updatedValue;
    if (currentRoutes) {
      updatedValue =
        currentRoutes.filter(o => o === routeToAdd).length === 0 &&
        currentRoutes.concat([routeToAdd]).toString();
    } else {
      updatedValue = routeToAdd;
    }

    if (updatedValue) {
      replaceQueryParams(this.context.router, { [preferType]: updatedValue });
    }
  };

  getCurrentOptions = () => {
    const { location, config } = this.context;
    const customizedSettings = getCustomizedSettings();
    const urlParameters = location.query;
    const defaultSettings = getDefaultSettings(config);
    defaultSettings.modes = ModeUtils.getDefaultModes(config);

    const obj = {};

    if (urlParameters) {
      Object.keys(defaultSettings).forEach(key => {
        obj[key] = urlParameters[key]
          ? urlParameters[key]
          : defaultSettings[key];
      });
    } else if (customizedSettings) {
      Object.keys(defaultSettings).forEach(key => {
        obj[key] = urlParameters[key]
          ? urlParameters[key]
          : defaultSettings[key];
      });
    }
    return obj;
  };

  getCurrentRoutes = preferType => {
    const currentOptions = this.getCurrentOptions();
    return (
      currentOptions[preferType] &&
      (currentOptions[preferType].match(/[,]/)
        ? currentOptions[preferType].split(',')
        : [currentOptions[preferType]])
    );
  };

  checkAndConvertModes = modes => {
    if (!Array.isArray(modes)) {
      return modes.match(/,/) ? modes.split(',') : [modes];
    } else if (Array.isArray(modes)) {
      return modes;
    }
    return [];
  };

  removeRoute = (val, preferType) => {
    const currentRoutes = this.getCurrentRoutes(preferType);
    replaceQueryParams(this.context.router, {
      [preferType]: currentRoutes.filter(o => o !== val).toString(),
    });
  };

  resetParameters = () => {
    const { config } = this.context;
    const defaultSettings = getDefaultSettings(config);
    defaultSettings.modes = ModeUtils.getDefaultModes(config).toString();
    resetCustomizedSettings();
    replaceQueryParams(this.context.router, defaultSettings);
  };

  renderStreetModeSelector = (config, router) => (
    <div className="settings-option-container street-mode-selector-panel-container">
      <StreetModeSelectorPanel
        className="customized-settings"
        selectedStreetMode={ModeUtils.getStreetMode(router.location, config)}
        selectStreetMode={(streetMode, isExclusive) =>
          ModeUtils.setStreetMode(streetMode, config, router, isExclusive)
        }
        showButtonTitles
        streetModeConfigs={ModeUtils.getAvailableStreetModeConfigs(config)}
      />
    </div>
  );

  render() {
    const { config, intl, router } = this.context;
    const {
      config: { accessibilityOptions },
    } = this.context;
    const { isOpen, onToggleClick } = this.props;
    const defaultSettings = getDefaultSettings(config);
    const merged = {
      ...defaultSettings,
      ...getCustomizedSettings(),
      ...this.context.location.query,
    };
    const currentOptions = this.getCurrentOptions();
    const checkedModes = this.checkAndConvertModes(currentOptions.modes);
    const isUsingBicycle =
      checkedModes.filter(o => o === StreetMode.Bicycle).length > 0;

    return (
      <div
        aria-hidden={!isOpen}
        role="button"
        tabIndex={0}
        className="customize-search-wrapper"
        // Clicks to the transparent area and close arrow should close the offcanvas
        onClick={onToggleClick}
        onKeyPress={onToggleClick}
      >
        <div
          className="customize-search"
          // Clicks mustn't bubble to prevent wrapper from closing the offcanvas
          role="button"
          onClick={e => e.stopPropagation()}
          onKeyPress={e => e.stopPropagation()}
          tabIndex={0}
        >
          <section className="offcanvas-section">
            <button
              className="close-offcanvas"
              onClick={onToggleClick}
              onKeyPress={onToggleClick}
            >
              <Icon className="close-icon" img="icon-icon_close" />
            </button>
            {this.renderStreetModeSelector(config, router)}
            {isUsingBicycle && (
              <div className="settings-option-container">
                <BikeTransportOptionsSection currentModes={checkedModes} />
              </div>
            )}
            <div className="settings-option-container">
              <TransportModesSection
                config={config}
                currentModes={checkedModes}
              />
            </div>
            <div className="settings-option-container">
              {isUsingBicycle ? (
                <BikingOptionsSection
                  walkReluctance={currentOptions.walkReluctance}
                  bikeSpeed={currentOptions.bikeSpeed}
                  defaultSettings={defaultSettings}
                />
              ) : (
                <WalkingOptionsSection
                  walkReluctance={currentOptions.walkReluctance}
                  walkSpeed={currentOptions.walkSpeed}
                  defaultSettings={defaultSettings}
                />
              )}
            </div>
            <div className="settings-option-container">
              <TransferOptionsSection
                walkBoardCost={currentOptions.walkBoardCost}
                minTransferTime={currentOptions.minTransferTime}
                defaultSettings={defaultSettings}
              />
            </div>
            <FareZoneSelector
              headerText={intl.formatMessage({
                id: 'zones',
                defaultMessage: 'Fare zones',
              })}
              options={get(config, 'fareMapping', {})}
              currentOption={merged.ticketTypes || 'none'}
              updateValue={value =>
                replaceQueryParams(router, { ticketTypes: value })
              }
            />
            <PreferredRoutes
              onRouteSelected={this.onRouteSelected}
              preferredRoutes={
                currentOptions.preferred && currentOptions.preferred.split(',')
              }
              unPreferredRoutes={
                currentOptions.unpreferred &&
                currentOptions.unpreferred.split(',')
              }
              removeRoute={this.removeRoute}
            />
            <div className="settings-option-container">
              <RoutePreferencesSection />
            </div>
            <div className="settings-option-container">
              <SelectOptionContainer
                currentSelection={currentOptions.accessibilityOption}
                defaultValue={defaultSettings.accessibilityOption}
                options={accessibilityOptions.map((o, i) => ({
                  title: accessibilityOptions[i].messageId,
                  value: accessibilityOptions[i].value,
                }))}
                onOptionSelected={value =>
                  replaceQueryParams(router, {
                    accessibilityOption: value,
                  })
                }
                title="accessibility"
              />
            </div>
            <div className="settings-option-container save-controls-container">
              <SaveCustomizedSettingsButton />
              <ResetCustomizedSettingsButton onReset={this.resetParameters} />
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default CustomizeSearch;
