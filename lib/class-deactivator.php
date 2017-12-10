<?php
/**
 * Fired during plugin deactivation.
 *
 * @since   1.0.0
 * @package @@name
 * @author  @@author <@@author_email>
 */

namespace ThatPluginCompany\PluginNamespace;

/**
 * Fired during plugin deactivation.
 *
 * This class defines all code necessary to run during the plugin's
 * deactivation.
 *
 * @since   1.0.0
 * @package @@name
 * @author  @@author <@@author_email>
 */
class Deactivator {

	/**
	 * Deactivation.
	 *
	 * @since 1.0.0
	 */
	public static function deactivate() {
		do_action( '@@prefix_deactivated' );
	}

}
