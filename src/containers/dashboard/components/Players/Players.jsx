import React from 'react'
import { List, Divider, Spin } from 'antd'
import { connect } from 'react-redux'
import GameStatusBar from '../GameStatusBar/GameStatusBar'
import { fetchTeamsBySpotlightId, fetchLibrePlayers } from '../../../../modules/spotlights'

class Players extends React.Component {
  constructor(props) {
    super(props)

    if (this.props.tournament !== 'libre') {
      this.props.fetchTeams(this.props.tournament)
    } else {
      this.props.fetchLibrePlayers()
    }
  }

  render() {
    if (this.props.tournament !== 'libre') {
      const teams = this.props.teams
        .filter(team => team.spotlightId === parseInt(this.props.tournament, 10))
        .filter(team => `${team.spotlightId}` === this.props.tournament)
        .filter(team => team.isInSpotlight)

      const spotlight = this.props.spotlights.find(s => `${s.id}` === this.props.tournament)

      if (!spotlight) {
        return <Spin />
      }

      return (
        <div>
          <GameStatusBar game={this.props.tournament} />
          <Divider />

          <h1>{`Joueurs pour ${spotlight.name}`}</h1>

          {teams.length > 0 ? (
            <List
              bordered
              dataSource={teams}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta title={item.name.substring(0, item.name.length - 10)} />
                  <div>{item.users[0].place}</div>
                </List.Item>
              )}
            />
          ) : (
            <Spin />
          )}
        </div>
      )
    }

    const { librePlayers } = this.props

    if (!librePlayers) {
      return <Spin />
    }

    return (
      <div>
        <h1>Joueurs du tournoi libre</h1>
        {librePlayers.length > 0 ? (
          <List
            bordered
            dataSource={librePlayers}
            renderItem={item => <List.Item>{item.name}</List.Item>}
          />
        ) : (
          <Spin />
        )}
      </div>
    )
  }
}
const mapStateToProps = state => ({
  teams: state.spotlights.teams || [],
  librePlayers: state.spotlights.librePlayers,
  spotlights: state.spotlights.spotlights,
})

const mapDispatchToProps = dispatch => ({
  fetchTeams: spotlightId => dispatch(fetchTeamsBySpotlightId(spotlightId)),
  fetchLibrePlayers: () => dispatch(fetchLibrePlayers()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Players)
