ig.module(
	'game.entities.monster'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityMonster = ig.Entity.extend({
	size: {x: 100, y: 100 },
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER, // Collision is already handled by Box2D!
	name: "MONSTER",
	state: "ON",
	zIndex: 10,
	

	init: function( x, y, settings ) {
		//call parent
		this.parent( x, y, settings );
		//console.log(ig.game);
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