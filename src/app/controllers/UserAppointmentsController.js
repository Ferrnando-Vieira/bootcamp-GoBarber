const { User } = require('../models')

class UserAppointmentsController {
  async show (req, res) {
    const userData = await User.findByPk(req.params.user)

    return res.render('appointments/userAppointments', { userData })
  }
}

module.exports = new UserAppointmentsController()
