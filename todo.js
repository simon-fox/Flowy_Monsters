- How to make ragdoll more interactible
- What is a satisfying interaction?
- Do we pin the chest down while he is not being interacted with?
- Are only certain joints interactible?\


- Start by pinning both feet

//- On grabbing a limb, when released, pin it 
	//- if grabbing a pinned limb, unpin it
	- give each limb body a unique ID so that similar limb segments do
	  not count as duplicates

- spawn objectives
	- sensor entities which require a specific limb ID to be dragged into them
	- dont need to be sensors specifically, could just be non-colliding static entities

- do selective collideConnected for joints - upper arms collide, others dont

- which bodies can be dragged & pinned?
	- limbSegments only
	- other body parts can currently be dragged but not pinned
	

- Abstract ragdoll spawning properly
	- create all joints with local positions relative to local 0,0
		- ie:  this.body.GetLocalCenter()?
		- or use pos.x and pos.y
			figure out if this refers to TOP LEFT or CENTER
	- spawn in bodies with similar logic
	- Allow for spawning in any number of body elements 
		- ie: 6 torso bodies
		- or arms with 4 limbSegments	

