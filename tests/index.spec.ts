import sinon from 'sinon';
import got from 'got';
import VK from '../src';
import fixtures from './__fixtures__';

describe('Request test', () => {
	beforeAll(() => {
		sinon
			.stub(got, 'post')
			.onCall(0)
			.resolves(fixtures.executeON)
			.onCall(1)
			.resolves(fixtures.executeOff)
			.onCall(2)
			.resolves(fixtures.failedExecuteON)
			.onCall(3)
			.resolves(fixtures.failedExecuteOff)
			.onCall(4)
			.resolves(fixtures.faledExecute)
			.onCall(5)
			.rejects(new Error('Some error'))
			.onCall(6)
			.rejects(new Error('Some error'));
	});

	afterAll(() => {
		sinon.reset();
	});

	it('Success request with execute on', async () => {
		const vk = new VK({
			token: 'acess_token',
			throttle: {
				executeON: true,
			},
		});

		const [[resOne], [resTwo]] = await Promise.all([
			vk.api<unknown[]>('users.get', { user_ids: '1' }),
			vk.api<unknown[]>('users.get', { user_ids: '2' }),
		]);

		expect(resOne).toBeDefined();
		expect(resOne).toStrictEqual(fixtures.executeON.body.response[0][0]);
		expect(resTwo).toBeDefined();
		expect(resTwo).toStrictEqual(fixtures.executeON.body.response[1][0]);
	});

	it('Success request with execute off', async () => {
		const vk = new VK({
			token: 'acess_token',
			throttle: {
				executeON: false,
			},
		});

		const res = await vk.api<unknown[]>('users.get', { user_ids: '1' });

		expect(res).toBeDefined();
		expect(res).toStrictEqual(fixtures.executeON.body.response[0]);
	});

	it('Failed request with execute on', async () => {
		const vk = new VK({
			token: 'acess_token',
			throttle: {
				executeON: true,
			},
		});

		await Promise.all([
			expect(vk.api('messages.send', {})).rejects.toStrictEqual(
				fixtures.failedExecuteON.body.execute_errors[0],
			),
			expect(vk.api('messages.send', {})).rejects.toStrictEqual(
				fixtures.failedExecuteON.body.execute_errors[1],
			),
		]);
	});

	it('Failed request with execute off', async () => {
		const vk = new VK({
			token: 'acess_token',
			throttle: {
				executeON: false,
			},
		});

		await expect(vk.api('messages.send', {})).rejects.toStrictEqual(
			fixtures.failedExecuteOff.body.error,
		);
	});

	it('Failed execute request', async () => {
		const vk = new VK({
			token: 'acess_token',
			throttle: {
				executeON: true,
			},
		});

		await Promise.all([
			expect(vk.api('messages.send', {})).rejects.toStrictEqual(fixtures.faledExecute.body.error),
			expect(vk.api('some..method', {})).rejects.toStrictEqual(fixtures.faledExecute.body.error),
		]);
	});

	it('Error request with execute on', async () => {
		const vk = new VK({
			token: 'acess_token',
			throttle: {
				executeON: true,
			},
		});

		await Promise.all([
			expect(vk.api('messages.send', {})).rejects.toThrow('Some error'),
			expect(vk.api('messages.send', {})).rejects.toThrow('Some error'),
		]);
	});

	it('Error request with execute off ', async () => {
		const vk = new VK({
			token: 'acess_token',
			throttle: {
				executeON: false,
			},
		});

		await expect(vk.api('messages.send', {})).rejects.toThrow('Some error');
	});
});
