import axios from 'axios';
import { WompiGatewayAdapter } from './wompi.gateway.adapter';
import { IChargeParams } from './model/IChargeParams.model';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WompiGatewayAdapter', () => {
  it('should return success when payment is processed correctly', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: {
          presigned_acceptance: {
            acceptance_token: 'abc-token',
          },
        },
      },
    });

    mockedAxios.post
      .mockResolvedValueOnce({ data: { data: { id: 'card-token-123' } } })
      .mockResolvedValueOnce({ data: { data: { id: 'txn-456' } } });

    const adapter = new WompiGatewayAdapter();

    const result = await adapter.charge({
      amount: 10000,
      cardNumber: '4111111111111111',
      cvc: '123',
      expiry: '12/25',
      cardHolder: 'John Doe',
      customerEmail: 'john@example.com',
      installments: 1,
    });

    expect(result.success).toBe(true);
    expect(result.transactionId).toBe('txn-456');
  });

  it('should fail if acceptance_token is missing', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { data: { presigned_acceptance: null } },
    });

    const adapter = new WompiGatewayAdapter();
    const result = await adapter.charge({
      amount: 10000,
      cardNumber: '4111111111111111',
      cvc: '123',
      expiry: '12/25',
      cardHolder: 'John Doe',
      customerEmail: 'john@example.com',
      installments: 1,
    });

    expect(result.success).toBe(false);
    expect(result.result).toBe('No acceptance token returned');
  });

  it('should fail if token is missing', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: { presigned_acceptance: { acceptance_token: 'abc' } },
      },
    });

    mockedAxios.post.mockResolvedValueOnce({ data: { data: null } });

    const adapter = new WompiGatewayAdapter();
    const result = await adapter.charge({
      amount: 10000,
      cardNumber: '4111111111111111',
      cvc: '123',
      expiry: '12/25',
      cardHolder: 'John Doe',
      customerEmail: 'john@example.com',
      installments: 1,
    });

    expect(result.success).toBe(false);
    expect(result.result).toBe('Failed to retrieve token from Wompi');
  });

  it('should catch and return error when axios throws', async () => {
    mockedAxios.get.mockRejectedValueOnce({
      response: { data: 'Unexpected failure' },
    });

    const adapter = new WompiGatewayAdapter();
    const result = await adapter.charge({
      amount: 10000,
      cardNumber: '4111111111111111',
      cvc: '123',
      expiry: '12/25',
      cardHolder: 'John Doe',
      customerEmail: 'john@example.com',
      installments: 1,
    });

    expect(result.success).toBe(false);
    expect(result.result).toBe('Unexpected failure');
  });
});
