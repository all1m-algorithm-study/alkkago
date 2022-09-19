## 잡담

명세를 최대한 많이 작성해보자
라고 해놓고 그냥 자버린거 너무 싫다

시뮬레이션은 충돌하는 것까지만 보여줌

360도 각도로 던지는 로직을 먼저 짠 다음
타겟을 기준으로 


다양한 예외들이 생각보다 화난다 돌이 겹쳐있는 경우는 어떻게 처리해야하지
일단 각도가 먼저 결정됨
공의 위치와 각도가 주어졌을 때 충돌하는 위치까지의 거리를 모든 각도에 대해 시도

처음 타겟까지는 속도를 잃지 않음

일단 충돌



각도가 정해지면
1. 해당 방향으로 가장 먼저 충돌하는 피스를 찾기
2. 해당 피스와 내 피스의 충돌 이후 속도와 방향을 계산
3. 이후부터는 일정 시간단위만큼 돌아감

if 충돌 판정 than 충돌 이후로 계산











## 객체 정의

solver : using bruteforce logic
simulater : using simulater
math : 그거 활용



<Solver>

- Init
- ScanInput
- PrintOutput
- Simulate



Solver
- init
    - simulater 초기화
- ScanInput
    - 형식에 맞게 입력을 받음
    - simulater 에 적용
- PrintOutput
    - result 를 출력



인터페이스처럼 어떻게 안되나 싶음
solver 을 초기화 할 때 simulater 을 사용

1. simulater 을 초기화
2. simulater 의 특정 값을 수정
3. simulater run



<Simulater>

Public Method
- AddPiece
- PutPieceState
- Run

Private Method
- Run 이 실행되는 구체적인 절차들을 정리



<Math>

GetCrushAxis : 두 돌 사이의 충돌 위치를 반환

UseFricEffect : 마찰력 감소를 계산하여 적용
UseCrushEffect : 

CheckCrush : 충돌을 판단



## 구조체 정의

- state struct :

condition : vel, dir
result : point, outOfBound

binary search 할 때 이렇게 반환된 구조체를 사용함



- piece struct :

vel, dir, color

state struct 에서 이 piece 를 활용하는게 더 좋을 것 같아


- pieces struct :

piece 의 배열





- step struct :






out of bound 보다 괜찮은 이름이 있는지


result 




// 너무 많은 내용을 구현하려고 하지는 말고, 구현의 컨셉만 잡으면 된다고 일단은





## 로직에 관한 설명



BruteForcing 의 절차
- every angle
- every vel by binary search






