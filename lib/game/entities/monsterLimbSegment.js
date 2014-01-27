ig.module(
	'game.entities.monsterLimbSegment'
)
.requires(
	'impact.entity',
	'plugins.box2d.entity'
)
.defines(function(){

EntityMonsterLimbSegment = ig.Box2DEntity.extend({
	size: {x: 20 , y: 100 },
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER, // Collision is already handled by Box2D!
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
	},

	createBody: function() {
		//build new body definition from prototype
		var bodyDef = new Box2D.Dynamics.b2BodyDef();
		//set values
	    bodyDef.position = new Box2D.Common.Math.b2Vec2(
			(this.pos.x ) * Box2D.SCALE,
			(this.pos.y ) * Box2D.SCALE
		); 
	    bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;    
	    //create body, assign to this class
	    this.body = ig.world.CreateBody(bodyDef);

	    //new fixture definition from prototype
	    var fixture = new Box2D.Dynamics.b2FixtureDef;
	    //set values
		fixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();   
	
		fixture.shape.SetAsBox( ( this.size.x / 2 ) * Box2D.SCALE , ( this.size.y / 2 ) * Box2D.SCALE );
	    fixture.density = 1.0;
	    fixture.friction = 0.1;
	    fixture.restitution = 0.4;
	    //create with body as parent 
	    this.fixture = this.body.CreateFixture(fixture);
	},
	
	
	update: function() {

		this.parent();
	}
});

});

