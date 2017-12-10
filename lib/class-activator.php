<?php
/**
 * Fired during plugin activation.
 *
 * @since   1.0.0
 * @package @@name
 * @author  @@author <@@author_email>
 */

namespace ThatPluginCompany\PluginNamespace;

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since   1.0.0
 * @package @@name
 * @author  @@author <@@author_email>
 */
class Activator {

	/**
	 * Activation.
	 *
	 * @since 1.0.0
	 */
	public static function activate() {
		do_action( '@@prefix_activated' );
	}

}
