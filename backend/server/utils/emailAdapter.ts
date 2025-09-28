export interface EmailAdapter {
  sendBookingConfirmation(to: string, courseTitle: string): Promise<void>
  sendCancellationConfirmation(to: string, courseTitle: string): Promise<void>
}

class NoopEmailAdapter implements EmailAdapter {
  async sendBookingConfirmation() {
    // noop
  }
  async sendCancellationConfirmation() {
    // noop
  }
}

export const emailAdapter: EmailAdapter = new NoopEmailAdapter()
