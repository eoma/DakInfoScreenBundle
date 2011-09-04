<?php

namespace Dak\InfoScreenBundle;

class ModuleManager {
	
	private $modules;
	
	public function __construct(array $modules) {
		$this->modules = $modules;
	}

	public function getModules() {
		return $this->modules;
	}
}
