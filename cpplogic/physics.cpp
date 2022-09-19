#include "api.cpp"
#include <cmath>


namespace PHYSICS {

    // 마찰력에 의한 가속도 (수정 바람)
    const unit FRIC_ACCEL = 0.55 * 9.8;

    co UnitVector(unit angle);

    // DeltaTime동안 변한 바둑돌의 상태를 최신화
    void UpdateMovement(piece& source, unit DeltaTime); 

    // 두 돌의 충돌에 의한 효과를 계산
    void UpdateCollision(piece& source, piece& target);

    // 두 돌이 충돌하는지 검사
    bool CheckCollision(piece& source, piece& target);

    // 시뮬레이션을 처음 시작할 경우에만 사용할 것, 최적해를 미리 찾을 때만 사용할 것.
    // 참고 : 충돌할 수 있다고 하더라도 속력이 부족할 경우 충돌하지 않을 수 있다.
    unit FindCollisionDistance(piece& White, piece& Black);

    // 시간 변화를 검사하지 않고 DistanceMoved 거리만큼 이동할 경우 돌의 상태를 최신화한다. 충돌 계산은 없다.
    void Initialize(piece& Black, unit DistanceMoved);

};


co PHYSICS::UnitVector(unit angle) {
    return co( cos(angle * M_PI/180), sin(angle * M_PI/180) );
}

void PHYSICS::UpdateMovement(piece& source, unit DeltaTime) {

    unit InitSpeed = source.vel.Norm();
    unit FinalSpeed = InitSpeed - PHYSICS::FRIC_ACCEL * DeltaTime;

    if ( FinalSpeed < 0 ) {
        source.active = false;
        FinalSpeed = 0;
    }

    source.SetVel( source.vel.UnitVector() * FinalSpeed );

    unit AverageSpeed = (InitSpeed + FinalSpeed)/2;
    co DeltaLocation = source.vel.UnitVector() * (AverageSpeed * DeltaTime);
    source.loc += DeltaLocation;
}

void PHYSICS::UpdateCollision(piece& source, piece& target) {
    if ( !CheckCollision(source, target)) return;

    source.active = true;
    target.active = true;

    co r = (target.loc - source.loc).UnitVector();
    co DeltaVelocity = r * ((source.vel - target.vel) * r);

    source.vel -= DeltaVelocity;
    target.vel += DeltaVelocity;
}

bool PHYSICS::CheckCollision(piece& source, piece& target) {
    return (source.loc - target.loc).Norm() < 2 * RADIUS;
}

unit PHYSICS::FindCollisionDistance(piece& White, piece& Black) {

    const unit R = (White.loc - Black.loc).Norm();
    const unit RCos = ((White.loc - Black.loc) * Black.vel) / Black.vel.Norm();

    unit Determine = 4*RADIUS*RADIUS + RCos * RCos - R*R;
    return ( Determine < 0 ) ? INF : (RCos - sqrt(Determine));
}

void PHYSICS::Initialize(piece& Black, unit DistanceMoved) {

    unit Determine = Black.vel.Norm() * Black.vel.Norm() - 2 * PHYSICS::FRIC_ACCEL * DistanceMoved;
    if ( Determine < 0 ) { Black.active = false; }

    unit NewSpeed = ( Determine < 0 ) ? 0 : sqrt(Determine);
    Black.SetVel(Black.vel.UnitVector() * NewSpeed);

    co DeltaLocation = Black.vel.UnitVector() * DistanceMoved;
    Black.SetLoc(Black.loc + DeltaLocation);
}