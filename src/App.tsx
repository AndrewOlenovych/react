import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import { axiosInterceptor } from './app/core/services/axios-interceptor';

const News = lazy(() => import('./app/routes/news'));
const Source = lazy(() => import('./app/routes/source'));

const App: React.FC = () => {
    axiosInterceptor()

    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Route exact path="/" component={Source}></Route>
                    <Route path="/news/:id" component={News} />
                </Switch>
            </Suspense>
        </Router>
    );
}

export default App;
