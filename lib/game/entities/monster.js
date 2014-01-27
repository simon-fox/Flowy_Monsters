ig.module(
	'game.entities.monster'
)
.requires(
	'impact.entity',
	'plugins.box2d.entity'
)
.defines(function(){

EntityMonster = ig.Box2DEntity.extend({
	size: {x: 80, y: 80 },
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER, // Collision is already handled by Box2D!
	name: "MONSTER",
	state: "ON",
	radius: 40,
	dampingRatio: 0.5,
	frequencyHz: 12,
	zIndex: 10,
	jointList: [],
	upForce: -150,

	init: function( x, y, settings ) {
		//create parts
		this.head = ig.game.spawnEntity( EntityMonsterHead , 0 , 0 );
		this.upperChest = ig.game.spawnEntity( EntityMonsterChest , 0 , 0 );
		this.torso = ig.game.spawnEntity( EntityMonsterChest , 0 , 0 );
		this.hips = ig.game.spawnEntity( EntityMonsterChest , 0 , 0 );
		this.leftUpperArm = ig.game.spawnEntity( EntityMonsterLimbSegment , 0 , 0 );
		this.leftLowerArm = ig.game.spawnEntity( EntityMonsterLimbSegment , 0 , 0 );
		this.rightUpperArm = ig.game.spawnEntity( EntityMonsterLimbSegment , 0 , 0 );
		this.rightLowerArm = ig.game.spawnEntity( EntityMonsterLimbSegment , 0 , 0 );
		this.leftUpperLeg = ig.game.spawnEntity( EntityMonsterLimbSegment , 0 , 0 );
		this.leftLowerLeg = ig.game.spawnEntity( EntityMonsterLimbSegment , 0 , 0 );
		this.rightUpperLeg = ig.game.spawnEntity( EntityMonsterLimbSegment , 0 , 0 );
		this.rightLowerLeg = ig.game.spawnEntity( EntityMonsterLimbSegment , 0 , 0 );

		//call parent
		this.parent( x, y, settings );
	},

	createBody: function() {

	},

	update: function() {
		//apply constant upward force
		//this.body.ApplyForce( new Box2D.Common.Math.b2Vec2(0,this.upForce), this.body.GetPosition() );
		this.parent();
	
	}

});

});