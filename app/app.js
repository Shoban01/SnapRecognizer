import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, HashRouter, Switch } from 'react-router-dom';
import GridApp from './gridApp';
ReactDOM.render((<HashRouter>
	<Switch>
	<Route exact path="/" component={GridApp} />
	</Switch>
</HashRouter>), document.getElementById("app"));