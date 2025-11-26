export type PaymentMethod = 'telebirr' | 'chapa' | 'cbe';

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message?: string;
}

export const paymentService = {
  /**
   * Simulates initiating a payment request.
   * In a real app, this would call your backend to generate a Chapa checkout URL or Telebirr Deep Link.
   */
  async processPayment(amount: number, method: PaymentMethod): Promise<PaymentResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate success probability (always success for demo)
    const success = true;

    if (success) {
      return {
        success: true,
        transactionId: `TXN-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        message: 'Payment processed successfully'
      };
    } else {
      return {
        success: false,
        message: 'Payment failed. Please try again.'
      };
    }
  },

  /**
   * Formats currency for display
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
    }).format(amount);
  }
};