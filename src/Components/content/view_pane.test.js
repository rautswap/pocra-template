import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import ViewPane from './view_pane';


test('checks correct response to tab-selection in the view-pane', () => {
	const { container, getByText } = render(<ViewPane />);
	const tabs_panes_grid = container.querySelector('#content-tabs-panes-grid');
	const maps_tab_button_grid = container.querySelector('#maps-tab-button-grid');
	const data_tab_button_grid = container.querySelector('#data-tab-button-grid');

	fireEvent.click(getByText('Maps'));
	expect(maps_tab_button_grid.className === 'selected');
	expect(data_tab_button_grid.className === 'not-selected');
	// expect(tabs_panes_grid).toMatchSnapshot();

	fireEvent.click(getByText('Data'));
	expect(maps_tab_button_grid.className === 'not-selected');
	expect(data_tab_button_grid.className === 'selected');
	// expect(tabs_panes_grid).toMatchSnapshot();
});