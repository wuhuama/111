import Mock from 'mockjs'
import api from './api'


Mock.mock(/\/refreshcode/ , 'get', api.refreshCode)
