const { User, Appointment } = require('../models')
const moment = require('moment')
const { Op, Sequelize } = require('sequelize')

class DashboardController {
  async index (req, res) {
    const provider = req.session.user.provider
    if (provider === true) {
      const dateInt = moment(parseInt(Date.now()))
      const id = req.session.user.id
      const appointments = await Appointment.findAll({
        attributes: ['user_id'],
        where: {
          provider_id: id,
          date: {
            [Op.between]: [
              dateInt.startOf('day').format(),
              dateInt.endOf('day').format()
            ]
          }
        },
        group: ['user_id']
      })

      const userId = appointments.map(ids => {
        const id = ids.user_id

        return id
      })

      const users = await User.findAll({
        where: {
          id: { [Op.in]: userId }
        }
      })
      return res.render('dashboard', { users })
    } else {
      const users = await User.findAll({ where: { provider: true } })
      return res.render('dashboard', { users })
    }
  }
}

module.exports = new DashboardController()
