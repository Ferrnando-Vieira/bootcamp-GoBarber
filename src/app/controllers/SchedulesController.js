const moment = require('moment')
const { Op } = require('sequelize')
const { Appointment } = require('../models')

class SchedulesController {
  async available (req, res) {
    const date = moment(parseInt(req.query.date))

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.provider,
        date: {
          [Op.between]: [
            date.startOf('day').format(),
            date.endOf('day').format()
          ]
        }
      }
    })

    const schedule = ['12:00', '13:00', '14:00', '21:00', '22:00', '23:00']

    const available = schedule.map(time => {
      const [hour, minute] = time.split(':')
      const value = date
        .hour(hour)
        .minute(minute)
        .second(0)

      return {
        time,
        value: value.format(),
        available:
          value.isAfter(moment()) &&
          !appointments.find(a => moment(a.date).format('HH:mm') === time)
      }
    })

    return res.render('schedules/available', { available })
  }

  async userSchedules (req, res) {
    const date = moment(parseInt(Date.now()))

    const appointments = await Appointment.findAll({
      attributes: ['date'],
      where: {
        user_id: req.params.provider,
        date: {
          [Op.between]: [
            date.startOf('day').format(),
            date.endOf('day').format()
          ]
        }
      }
    })

    const times = appointments.map(time => {
      const dateTime = moment(time.date).format('HH:mm')

      return dateTime
    })

    return res.render('schedules/userSchedules', { times })
  }
}

module.exports = new SchedulesController()
