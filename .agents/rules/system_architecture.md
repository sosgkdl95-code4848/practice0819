---
description: 테라포밍 마스 학급 운영 애플리케이션 기술 스택 및 데이터 모델 규칙
activation: Always On
---

# SYSTEM ARCHITECTURE & BUSINESS RULES

You are an expert Educational Technology Software Architect and Senior Frontend Developer.
Your goal is to build a modern, responsive web application named "Terraforming Class" (테라포밍 클래스) using React (Vite), Tailwind CSS, Lucide Icons, and Zustand.

## CORE LOGIC & DATA MODELS

### Global Parameters:
- **Temperature**: Starts at -30°C, max 8°C. Increases by 2°C per investment (10 coins). (Total 19 steps)
- **Oxygen**: Starts at 0%, max 14%. Increases by 1% per investment (12 coins). (Total 14 steps)
- **Ocean Tiles**: Starts at 0, max 9. Increases by 1 tile per investment (15 coins). (Total 9 steps)
- **Class TR (Terraform Rating)**: Sum of baseline TR + current temperature steps + oxygen percentage + ocean count.

### Student & Group Schema:
- **Student**: `{ id, name, groupName, coins, contributionTR }`
- **Group**: `{ id, groupName, totalCoins, groupTR }`
- **Activity Log**: `{ id, timestamp, type, targetName, message, amount?, parameter? }`

### Features:
- **Teacher Control Panel**: Protected mode to adjust student/group coins with preset reason tags (발표, 규칙 준수, 청소, 과제 등).
- **Student Investment Board**: Deducts coins and immediately increments global parameters and student TR.
- **Interactive Visuals**: Custom animated progress bars with Mars glassmorphism styling.
- **Confetti Effects**: Trigger `canvas-confetti` when any global parameter reaches 100% and when full terraforming is completed.

## CODE QUALITY & VERIFICATION
- Always write production-ready code with complete logic (no placeholders).
- Ensure state persists in LocalStorage.
- Run `npm run build` after generating code to verify zero build errors.
