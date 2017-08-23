describe('Test Suite', function() {
	var DemoService;
	
	beforeEach(module('demo.services'));
	
	beforeEach(inject(function(_DemoService_) {
		DemoService = _DemoService_;
	}))
	
	it('Demo Test', function() {
		expect(DemoService.doSomething()).toBe(true);
	});
});