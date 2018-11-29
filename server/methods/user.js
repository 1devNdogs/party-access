Meteor.methods({
	'Users.insert': function(doc) {
		try {
			validateParams(doc);
			Accounts.createUser(doc);
			return true;
		} catch (e) {
			logError(e);
		}
	},
	'Users.update': function(userId, doc) {
		try {
			if (doc.newPassword.length > 0 && doc.confirmNewPassword.length > 0)
				Meteor.call('changePasswordUser', userId, doc.newPassword, doc.confirmNewPassword)
			Meteor.users.update(userId, {
				$set: {
					'emails.0.address': doc.email,
					'profile.name': doc.profile.name,
					'profile.userType': doc.profile.userType
				}
			})
		} catch (e) {
			logError(e);
		}
	},
	'Users.remove': function(userId) {
		try {
			console.log(this.userId);
			if (userId === this.userId) {
				throw new Meteor.Error('Cant Remove Yourself.', 'cant do action', 'cant do action');
			}
			Meteor.users.update(userId, {
				$set: {
					'profile.active': false
				}
			});
			Accounts.setPassword(userId, '73932646')

		} catch (e) {
			logError(e);
		}
	},
	'changePasswordUser': function(userId, newPassword, confirmNewPassword) {
		if (newPassword != confirmNewPassword) {
			var errMessage = 'New Password and Password Confirmation must be equal';
			throw new Meteor.Error(errMessage);
		} else if (newPassword.length < 6) {
			var errMessage = 'New Password at least has 6 min length';
			throw new Meteor.Error(errMessage);
		}
		Accounts.setPassword(userId, newPassword, function(err) {
			if (err) {
				throw new Meteor.Error(err.message);
			} else {
				return {ok: true}
			}
		});
	}
});

function validateParams(params) {
	for (var key in params) {
		if (key == "profile") {
			for (var keyProfile in params[key]) {
				value = params[key][keyProfile];
				//                console.log("UsersServer.js " + value);
				if (value === "" && typeof value === 'string') {
					throw new Meteor.Error('Please enter your ' + keyProfile, keyProfile);
				}
			}
		} else if (key == "email") {
			value = params[key];
			if (!validateEmail(value))
				throw new Meteor.Error('Please format email ' + key, key);

			}
		else {
			value = params[key];
			//            console.log("UsersServer.js " + value);
			if (value == "")
				throw new Meteor.Error('Please enter your ' + key, key);
			}
		}

}

function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}
