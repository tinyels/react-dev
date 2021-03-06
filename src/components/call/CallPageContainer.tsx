import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Issue } from '../../common/model';
import { CallPage } from './index';
import { ApplicationState } from '../../redux/root';
import { getIssuesIfNeeded } from '../../redux/remoteData';
import { CallState, OutcomeData, submitOutcome, selectIssueActionCreator } from '../../redux/callState';
import { clearAddress } from '../../redux/location';
import { LocationState } from '../../redux/location/reducer';

/*
  The Container Component(such as this one) exist to connect a react component to the Redux store.
  The pattern that the 5Calls app is using is to have 1 container component for each
  "page".
  A page is represented by a route as defined in the /src/index.tsx file.
  The "page" that this container component provides a connection to Redux for is "Home"
  The route is:
     <Route path="/" exact={true} component={HomePageContainer} />
  A container maps data from Redux through the "mapStateToProps" method
          and maps actions from Redux through the "mapDispatchToProps" method

  In order to maintain type safety in the container and its children, TypeScript requires
    that you define both the same data and action (function) properties and types in the
    container (HomePageContainer) and its first child (HomePage). The data-related properties
    used in mapStateToProps() are called StateProps, while the action-related properties
    used in mapDispatchToProps() are called DispatchProps. In the children components, these are called
    "Props" since they are standard React props.

  In this container component, we will pull all of the data/actions(functions) off of Redux that this Page
    (its child components) need and we will pass them down to them through their props.  We call
    the Page and it child components the Component Hierarchy. This leads to passing data through multiple
    components.  However, the benefit of this pattern is that we are not access the "global" Redux state
    from everywhere in the application.  We have one entry point to it for every page, at the top level of the
    component hierarchy.
*/
interface OwnProps extends RouteComponentProps<{ id: string }> { }

// This defines the data that we will pull off the Redux store
interface StateProps {
  readonly callState: CallState;
  readonly currentIssue?: Issue;
  readonly splitDistrict: boolean;
  readonly locationState: LocationState;

}

/*
 This defines the actions that we pass a reference to to our child components.
   By calling these methods, child components will be able to dispatch redux actions
*/
interface DispatchProps {
  // This defines a method signature that is going to be passed into the child component
  readonly onSubmitOutcome: (data: OutcomeData) => void;
  readonly onGetIssuesIfNeeded: () => void;
  readonly onSelectIssue: (issueId: string) => void;
  readonly clearLocation: () => void;
}

/*
 This is the standard method that takes the Redux store and allows us to pull data off it
 and pass it into the child component.  You can do logic in this method before passing back
 the object with the props (see the Call page for an example).
*/
const mapStateToProps = (state: ApplicationState, ownProps: OwnProps): StateProps => {
  let currentIssue: Issue | undefined = undefined;
  if (state.remoteDataState.issues && state.remoteDataState.inactiveIssues) {
    currentIssue = state.remoteDataState.issues
                   .concat(state.remoteDataState.inactiveIssues)
                   .find(i => i.id === ownProps.match.params.id);
  }

  return {
    callState: state.callState,
    currentIssue: currentIssue,
    splitDistrict: state.locationState.splitDistrict, // todo: just pass locationState and remove separate splitDistrict
    locationState: state.locationState
  };
};

/*
  This is the standard method that takes the Redux store's dispatch method and allows
 us to pass actions(functions, actionCreators are other words for this) to it and have it
 map to the child component.
*/
const mapDispatchToProps = (dispatch: Dispatch<ApplicationState>): DispatchProps => {
  return bindActionCreators(
    {
      /*
        REDUX DATA FLOW 1: This connects a method that is passed into the child components to
          an action creator that can take action on the Redux Store.
        This particular method will be passed down through following components:
            HomePage -> Layout -> Sidebar -> IssueList -> IssueListItem
        When an IssueListItem is clicked on, this method will be called and this action
            will be dispatched.
        See /src/redux/callState/actionCreator.ts for next step in Redux Data Flow
      */
      onSubmitOutcome: submitOutcome,
      onSelectIssue: selectIssueActionCreator,
      onGetIssuesIfNeeded: getIssuesIfNeeded,
      clearLocation: clearAddress
    },
    dispatch);
};

/* This is the key "magic" function that "connects" this redux container component to the child
     component.  It is also where you often get errors.
    The connect<StateProps, DispatchProps, OwnProps> function will "merge" the interfaces
    that you've defined as generic type parameters.
      e.g. in this case <StateProps, DispatchProps, OwnProps>

    Therefore, the "HomePage" component must have defined its "Props" to match have
    all of the properties that this merged interface will have.  Otherwise, you will get
    a cryptic error message.

    There are many signatures for this connect function, as you'll see in our other containers in this
    app.  You can click F12(VSCode) on it and try it will take you to the TypeScript definition.
*/
export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(CallPage);
