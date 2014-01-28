- How to make ragdoll more interactible
- What is a satisfying interaction?
- Do we pin the chest down while he is not being interacted with?
- Are only certain joints interactible?\


- Start by pinning both feet

- On grabbing a limb, when released, pin it 
	- if grabbing a pinned limb, unpin it

- which bodies can be dragged?
	- limbSegments
	- Both chest pieces?
	- Head?

- Abstract ragdoll spawning properly
	- create all joints with local positions relative to local 0,0
		- ie:  this.body.GetLocalCenter()?
		- or use pos.x and pos.y
			figure out if this refers to TOP LEFT or CENTER
	- spawn in bodies with similar logic
	- Allow for spawning in any number of body elements 
		- ie: 6 torso bodies
		- or arms with 4 limbSegments	
		
