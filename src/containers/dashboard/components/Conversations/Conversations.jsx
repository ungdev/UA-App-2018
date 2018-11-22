import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { autoLogin } from '../../../../modules/login'
import {
  fetchConversations,
  SET_CONVERSATIONS_LOADING
} from '../../../../modules/conversations'
import { List, Card } from 'antd'

class Conversations extends React.Component {
  constructor(props) {
    super(props)
    this.loadConversations()
    this.state = {
      conversations: this.props.conversations,
      user: this.props.user
    }
  }

  loadConversations() {
    this.props.setLoading()
    this.props.getConversations()
  }

  componentDidUpdate(prevProps, prevStates) {
    if (prevProps !== this.props) {
      this.setState({
        conversations: this.props.conversations,
        user: this.props.user
      })
    }
  }

  render() {
    if (this.props.user && this.props.user.isAdmin !== 100)
      this.props.redirectToHome()
    let { conversations } = this.state
    console.log(conversations)
    // let conversationsList = conversations.map(conversation => {
    //   return (
    //     <Card
    //       title={conversation.User2.name} />
    //   )
    // })
    let conversationsList = (
      <List
        itemLayout="horizontal"
        dataSource={conversations.map(conversation => {
          return { title: conversation.User2.name, idTo: conversation.User2.id, spotlight: conversation.User2.team.spotlightId }
        })}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={item.title}
              description={<Link to={{pathname: `/dashboard/admin/messages/${item.idTo}`}}>Accéder à la conversation</Link>}
            />
          </List.Item>
        )}
      />
    )
    return <div>{conversationsList}</div>
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
  conversations: state.conversations.conversations,
  loading: state.conversations.loading,
  location: state.routing.location.pathname
})

const mapDispatchToProps = dispatch => ({
  autoLogin: () => dispatch(autoLogin()),
  redirectToHome: () => dispatch(push('/dashboard/home')),
  goToHome: () => dispatch(push('/dashboard/home')),
  getConversations: () => dispatch(fetchConversations()),
  // sendMessage: (spotlight, title, text) => dispatch(sendMessage(spotlight, title, text)),
  setLoading: () => dispatch({ type: SET_CONVERSATIONS_LOADING })
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Conversations)
