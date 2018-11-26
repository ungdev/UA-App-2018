import axios from '../lib/axios'
import errorToString from '../lib/errorToString'
import { actions as notifActions } from 'redux-notifications'
import moment from 'moment'

export const SET_USERS = 'admin/SET_USERS'
export const SET_USER_RESPO = 'admin/SET_USER_RESPO'
export const REMOVE_USER_RESPO = 'admin/REMOVE_USER_RESPO'

const initialState = {
  users: [],
  spotlights: [],
  chartData: { daily: [], cumul: [] },
}

export default (state = initialState, action) => {
  let users = state.users.slice(0)
  const userId = action.payload
  const index = users.findIndex(u => u.id === userId)

  switch (action.type) {
    case SET_USERS:
      return {
        ...state,
        users: action.payload
      }
    
    case SET_USER_RESPO:
      users[index].permission.respo = true
      return {
        ...state,
        users
      }
    case REMOVE_USER_RESPO:
      users[index].permission.respo = false
      return {
        ...state,
        users
      }
    default:
      return state
  }
}

export const setRespo = (id, spotlights) => {
  return async (dispatch, getState) => {
    const authToken = getState().login.token

    if (!authToken || authToken.length === 0) {
      return
    }
    try {
      const res = await axios.put(`/admin/setrespo/${id}`, { respo: spotlights}, { headers: { 'X-Token': authToken } })

      if(res.status === 200) {
        dispatch({ type: SET_USER_RESPO, payload: id })
        dispatch(
          notifActions.notifSend({
            message: 'L\'utilisateur est maintenant responsable de tournoi',
            dismissAfter: 2000
        }))
      }
    } catch (err) {
      console.log(err)
      dispatch(
        notifActions.notifSend({
          message: 'Une erreur est survenue',
          kind: 'danger',
          dismissAfter: 2000
      }))
    }
  }
}