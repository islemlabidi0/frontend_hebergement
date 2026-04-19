import axios from 'axios'

const API_URL = 'http://localhost:8080'

export default {
  getAllBlocs() {
    return axios.get(`${API_URL}/api/blocs`)
  },

  addBloc(bloc) {
    return axios.post(`${API_URL}/api/blocs`, bloc)
  },

  deleteBloc(id) {
    return axios.delete(`${API_URL}/api/blocs/${id}`)
  },

  getBlocById(id) {
    return axios.get(`${API_URL}/api/blocs/${id}`)
  },

  updateBloc(id, bloc) {
    return axios.put(`${API_URL}/api/blocs/${id}`, bloc)
  },

  getBlocsByFoyer(foyerId) {
    return axios.get(`${API_URL}/api/blocs/foyer/${foyerId}`)
  }
}