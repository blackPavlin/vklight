export default {
	// Success request with execute on
	executeON: {
		body: {
			response: [
				[
					{
						first_name: 'Павел',
						id: 1,
						last_name: 'Дуров',
						can_access_closed: true,
						is_closed: false,
					},
				],
				[
					{
						first_name: 'Александра',
						id: 2,
						last_name: 'Владимирова',
						can_access_closed: false,
						is_closed: true,
					},
				],
			],
		},
	},
	// Success request with execute off
	executeOff: {
		body: {
			response: [
				{
					first_name: 'Павел',
					id: 1,
					last_name: 'Дуров',
					can_access_closed: true,
					is_closed: false,
				},
			],
		},
	},
	// Failed request with execute on
	failedExecuteON: {
		body: {
			response: [false, false],
			execute_errors: [
				{
					method: 'messages.send',
					error_code: 100,
					error_msg:
						'One of the parameters specified was missing or invalid: random_id is a required parameter',
				},
				{
					method: 'messages.send',
					error_code: 100,
					error_msg:
						'One of the parameters specified was missing or invalid: random_id is a required parameter',
				},
			],
		},
	},
	// Failed request with execute off
	failedExecuteOff: {
		body: {
			error: {
				method: 'messages.send',
				error_code: 100,
				error_msg:
					'One of the parameters specified was missing or invalid: random_id is a required parameter',
			},
		},
	},
	// Failed execute request
	faledExecute: {
		body: {
			error: {
				error_code: 12,
				error_msg: 'Unable to compile code: "(" expected, ".." found in line 1',
				request_params: [
					{
						key: 'oauth',
						value: '1',
					},
				],
			},
		},
	},
};
