"""
bandits.py

Contains:
- EpsilonGreedyBandit
- UCB1Bandit
- ThompsonSamplingBandit (Bernoulli)

Quick demo at the bottom compares the algorithms on synthetic Bernoulli arms.
"""

import math
import random
from typing import List, Sequence, Optional


class EpsilonGreedyBandit:
    """Epsilon-greedy for general reward (keeps running average)."""
    def __init__(self, n_arms: int, epsilon: float = 0.1, seed: Optional[int] = None):
        self.n = n_arms
        self.epsilon = epsilon
        self.counts = [0] * n_arms
        self.values = [0.0] * n_arms
        if seed is not None:
            random.seed(seed)

    def select(self) -> int:
        if random.random() < self.epsilon:
            return random.randrange(self.n)
        else:
            
            maxv = max(self.values)
            candidates = [i for i, v in enumerate(self.values) if v == maxv]
            return random.choice(candidates)

    def update(self, arm: int, reward: float) -> None:
        self.counts[arm] += 1
       
        n = self.counts[arm]
        self.values[arm] += (reward - self.values[arm]) / n


class UCB1Bandit:
    """UCB1 algorithm (Auer et al.). Assumes non-negative rewards; works with averages."""
    def __init__(self, n_arms: int, seed: Optional[int] = None):
        self.n = n_arms
        self.counts = [0] * n_arms
        self.values = [0.0] * n_arms
        self.t = 0
        if seed is not None:
            random.seed(seed)

    def select(self) -> int:
        self.t += 1
        
        for i in range(self.n):
            if self.counts[i] == 0:
                return i
       
        ucb_scores = [
            self.values[i] + math.sqrt(2 * math.log(self.t) / self.counts[i])
            for i in range(self.n)
        ]
        maxscore = max(ucb_scores)
        candidates = [i for i, s in enumerate(ucb_scores) if s == maxscore]
        return random.choice(candidates)

    def update(self, arm: int, reward: float) -> None:
        self.counts[arm] += 1
        n = self.counts[arm]
        self.values[arm] += (reward - self.values[arm]) / n


class ThompsonSamplingBandit:
    """Thompson Sampling for Bernoulli rewards (Beta-Bernoulli)."""
    def __init__(self, n_arms: int, seed: Optional[int] = None):
        self.n = n_arms
      
        self.alpha = [1] * n_arms
        self.beta = [1] * n_arms
        if seed is not None:
            random.seed(seed)

    def select(self) -> int:
        samples = [random.betavariate(self.alpha[i], self.beta[i]) for i in range(self.n)]
        max_s = max(samples)
        candidates = [i for i, s in enumerate(samples) if s == max_s]
        return random.choice(candidates)

    def update(self, arm: int, reward: int) -> None:
      
        if reward not in (0, 1):
            raise ValueError("ThompsonSamplingBandit expects Bernoulli rewards 0/1.")
        if reward == 1:
            self.alpha[arm] += 1
        else:
            self.beta[arm] += 1


# -----------------------
# Simulation/demo
# -----------------------
def simulate(algorithm, arm_probs: Sequence[float], steps: int = 1000):
    """
    Simulate bandit algorithm on Bernoulli arms with given probabilities.
    Returns cumulative reward and history of chosen arms.
    """
    total_reward = 0.0
    chosen = []
    for _ in range(steps):
        arm = algorithm.select()
        
        reward = 1 if random.random() < arm_probs[arm] else 0
        algorithm.update(arm, reward)
        total_reward += reward
        chosen.append(arm)
    return total_reward, chosen


if __name__ == "__main__":
   
    true_probs = [0.20, 0.50, 0.75]
    STEPS = 2000
    SEED = 42

    
    eg = EpsilonGreedyBandit(n_arms=len(true_probs), epsilon=0.1, seed=SEED)
    total_eg, choice_eg = simulate(eg, true_probs, STEPS)
    print(f"Epsilon-Greedy (epsilon=0.1): total reward={total_eg}/{STEPS}, avg={total_eg/STEPS:.4f}")

    
    ucb = UCB1Bandit(n_arms=len(true_probs), seed=SEED)
    total_ucb, choice_ucb = simulate(ucb, true_probs, STEPS)
    print(f"UCB1: total reward={total_ucb}/{STEPS}, avg={total_ucb/STEPS:.4f}")

    
    ts = ThompsonSamplingBandit(n_arms=len(true_probs), seed=SEED)
    total_ts, choice_ts = simulate(ts, true_probs, STEPS)
    print(f"Thompson Sampling: total reward={total_ts}/{STEPS}, avg={total_ts/STEPS:.4f}")
