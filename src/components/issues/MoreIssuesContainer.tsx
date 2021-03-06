import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ApplicationState } from '../../redux/root';
import { MoreIssuesPage } from './index';
import { Issue } from '../../common/model';
import { getIssuesIfNeeded } from '../../redux/remoteData';
import { selectIssueActionCreator } from '../../redux/callState';

import { RouteComponentProps } from 'react-router-dom';

interface OwnProps extends RouteComponentProps<{ id: string }> { }

interface StateProps {
  readonly issues: Issue[];
  readonly currentIssue?: Issue;  
  readonly completedIssueIds: string[];
}

interface DispatchProps { 
  readonly onSelectIssue: (issueId: string) => void;
  readonly onGetIssuesIfNeeded: () => void;
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps): StateProps => {
  let currentIssue: Issue | undefined = undefined;
  if (state.remoteDataState.issues) {
    currentIssue = state.remoteDataState.issues.find(i => i.id === ownProps.match.params.id);
  }

  return {
    issues: state.remoteDataState.inactiveIssues,
    currentIssue: currentIssue,
    completedIssueIds: state.callState.completedIssueIds,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<ApplicationState>): DispatchProps => {
  return bindActionCreators(
    {
      onSelectIssue: selectIssueActionCreator,
      onGetIssuesIfNeeded: getIssuesIfNeeded,
    },
    dispatch);
};

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(MoreIssuesPage);
