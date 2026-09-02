import { FinishAuctionsUseCase } from '../../application/use-cases/FinishAuctionsUseCase';

export function startAuctionCron(finishAuctionsUseCase: FinishAuctionsUseCase, intervalMs: number = 60000) {
  const timer = setInterval(async () => {
    try {
      await finishAuctionsUseCase.execute();
    } catch (error) {
      console.error('Error running auction cron:', error);
    }
  }, intervalMs);

  return {
    stop: () => clearInterval(timer)
  };
}
